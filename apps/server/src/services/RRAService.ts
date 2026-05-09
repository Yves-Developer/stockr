import axios from "axios";

/**
 * Service to handle integration with Rwanda Revenue Authority (RRA) 
 * Virtual Sales Data Controller (VSDC) API.
 */
export class RRAService {
  private static baseURL = process.env.RRA_VSDC_URL || "http://localhost:8080";
  private static tin = process.env.RRA_TIN || "";
  private static bhfId = process.env.RRA_BRANCH_ID || "00";
  private static dvcSrlNo = process.env.RRA_DEVICE_SERIAL || "";

  /**
   * Initializes the VSDC device with RRA.
   * Required for authentication and key exchange.
   */
  static async initializeDevice() {
    try {
      const response = await axios.post(`${this.baseURL}/initializer/selectInitInfo`, {
        tin: this.tin,
        bhfId: this.bhfId,
        dvcSrlNo: this.dvcSrlNo,
      });

      return response.data;
    } catch (error: any) {
      console.error("RRA Initialization Error:", error.message);
      throw new Error(`Failed to initialize RRA device: ${error.message}`);
    }
  }

  /**
   * Fetches latest standard codes from RRA.
   * Includes tax types, quantity units, etc.
   */
  static async getStandardCodes() {
    try {
      const response = await axios.post(`${this.baseURL}/code/selectCodes`, {
        tin: this.tin,
        bhfId: this.bhfId,
        lastReqDt: "20230101000000", // Example start date
      });

      return response.data;
    } catch (error: any) {
      console.error("RRA Fetch Codes Error:", error.message);
      throw new Error(`Failed to fetch standard codes: ${error.message}`);
    }
  }

  /**
   * Reports a sales transaction to RRA.
   * This is what replaces the physical EBM machine.
   */
  static async reportSale(saleData: any) {
    try {
      const response = await axios.post(`${this.baseURL}/trnsSales/saveSales`, {
        tin: this.tin,
        bhfId: this.bhfId,
        ...saleData
      });

      return response.data;
    } catch (error: any) {
      console.error("RRA Sale Reporting Error:", error.message);
      throw new Error(`Failed to report sale to RRA: ${error.message}`);
    }
  }
}
