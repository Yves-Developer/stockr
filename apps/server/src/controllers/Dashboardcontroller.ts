import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import Supplier from "../models/Supplier";
import StockMovement from "../models/StockMovement";

// GET /api/dashboard
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalStockIn,
      totalStockOut,
      lowStockProducts,
      recentMovements,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Supplier.countDocuments(),
      StockMovement.aggregate([
        { $match: { type: "IN" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      StockMovement.aggregate([
        { $match: { type: "OUT" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      // Products with quantity less than 10 (low stock alert)
      Product.find({ quantity: { $lt: 10 } })
        .populate("category", "name")
        .select("name sku quantity")
        .limit(5),
      // Last 5 stock movements
      StockMovement.find()
        .populate("product", "name sku")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalSuppliers,
        totalStockIn: totalStockIn[0]?.total || 0,
        totalStockOut: totalStockOut[0]?.total || 0,
        lowStockProducts,
        recentMovements,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};