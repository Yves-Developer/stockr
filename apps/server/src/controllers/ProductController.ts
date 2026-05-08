import { Request, Response } from "express";
import Product from "../models/Product";

// ─── GET /api/products ────────────────────────────────────────────────────────
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      supplier,
      minPrice,
      maxPrice,
      lowStock,       // ?lowStock=true  → products with quantity < 10
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query: Record<string, any> = {};

    // Search by name, description or SKU
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (supplier) query.supplier = supplier;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (lowStock === "true") {
      query.quantity = { $lt: 10 };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .populate("supplier", "name email phone")
        .sort({ [sortBy as string]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name description")
      .populate("supplier", "name email phone address");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, category, supplier, sku, imageUrl } = req.body;

    if (!name || !price || !category || !sku) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category and SKU are required",
      });
    }

    // Ensure SKU is unique
    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      return res.status(400).json({ success: false, message: "SKU already exists" });
    }

    const product = await Product.create({
      name, description, price, quantity, category, supplier, sku, imageUrl,
    });

    const populated = await product.populate([
      { path: "category", select: "name" },
      { path: "supplier", select: "name email" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("category", "name")
      .populate("supplier", "name email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};