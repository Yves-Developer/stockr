import { Request, Response } from "express";
import Supplier from "../models/Supplier";
import Product from "../models/Product";

// ─── GET /api/suppliers ───────────────────────────────────────────────────────
export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const { search, page = "1", limit = "10" } = req.query;

    const query: Record<string, any> = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [suppliers, total] = await Promise.all([
      Supplier.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Supplier.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/suppliers/:id ───────────────────────────────────────────────────
export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/suppliers/:id/products ─────────────────────────────────────────
export const getProductsBySupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    const products = await Product.find({ supplier: req.params.id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── POST /api/suppliers ──────────────────────────────────────────────────────
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const exists = await Supplier.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Supplier with this email already exists" });
    }

    const supplier = await Supplier.create({ name, email, phone, address });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── PUT /api/suppliers/:id ───────────────────────────────────────────────────
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── DELETE /api/suppliers/:id ────────────────────────────────────────────────
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    // Prevent deleting if products still reference this supplier
    const productCount = await Product.countDocuments({ supplier: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} product(s) are linked to this supplier`,
      });
    }

    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};