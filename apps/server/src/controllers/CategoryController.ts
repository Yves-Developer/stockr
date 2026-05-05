import { Request, Response } from "express";
import Category from "../models/Category";
import Product from "../models/Product";

// ─── GET /api/categories ──────────────────────────────────────────────────────
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { search, page = "1", limit = "10" } = req.query;

    const query: Record<string, any> = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Category.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/categories/:id ──────────────────────────────────────────────────
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/categories/:id/products ────────────────────────────────────────
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const products = await Product.find({ category: req.params.id })
      .populate("supplier", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── POST /api/categories ─────────────────────────────────────────────────────
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const exists = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── PUT /api/categories/:id ──────────────────────────────────────────────────
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── DELETE /api/categories/:id ───────────────────────────────────────────────
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // Prevent deleting if products still use this category
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} product(s) still use this category`,
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};