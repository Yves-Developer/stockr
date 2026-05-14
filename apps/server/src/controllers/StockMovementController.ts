import { Request, Response } from "express";
import StockMovement from "../models/StockMovement";
import Product from "../models/Product";

// ─── GET /api/stock-movements ─────────────────────────────────────────────────
export const getAllStockMovements = async (req: Request, res: Response) => {
  try {
    const {
      product,
      type,         // "IN" or "OUT"
      reason,       // "purchase" | "sale" | "damaged" | "returned"
      startDate,
      endDate,
      page = "1",
      limit = "10",
    } = req.query;

    const query: Record<string, any> = {};

    if (product) query.product = product;
    if (type) query.type = type;
    if (reason) query.reason = reason;

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate("product", "name sku quantity")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      StockMovement.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: movements.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: movements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/stock-movements/:id ────────────────────────────────────────────
export const getStockMovementById = async (req: Request, res: Response) => {
  try {
    const movement = await StockMovement.findById(req.params.id)
      .populate("product", "name sku quantity");

    if (!movement) {
      return res.status(404).json({ success: false, message: "Stock movement not found" });
    }
    res.status(200).json({ success: true, data: movement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── POST /api/stock-movements ────────────────────────────────────────────────
export const createStockMovement = async (req: Request, res: Response) => {
  try {
    const { product, type, quantity, reason, note, date } = req.body;

    if (!product || !type || !quantity || !reason) {
      return res.status(400).json({
        success: false,
        message: "Product, type, quantity and reason are required",
      });
    }

    if (!["IN", "OUT"].includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be IN or OUT" });
    }

    // Check product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update product stock quantity
    if (type === "IN") {
      existingProduct.quantity += Number(quantity);
    } else if (type === "OUT") {
      if (existingProduct.quantity < Number(quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${existingProduct.quantity}`,
        });
      }
      existingProduct.quantity -= Number(quantity);
    }

    await existingProduct.save();

    const movement = await StockMovement.create({ product, type, quantity, reason, note, date });
    const populated = await movement.populate("product", "name sku quantity");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── GET /api/stock-movements/product/:productId ──────────────────────────────
export const getMovementsByProduct = async (req: Request, res: Response) => {
  try {
    const movements = await StockMovement.find({ product: req.params.productId })
      .populate("product", "name sku")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: movements.length, data: movements });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// --- PUT /api/stock-movements/:id --------------------------------------------
export const updateStockMovement = async (req: Request, res: Response) => {
  try {
    const { product, type, quantity, reason, note, date } = req.body;
    const movementId = req.params.id;

    const oldMovement = await StockMovement.findById(movementId);
    if (!oldMovement) {
      return res.status(404).json({ success: false, message: "Stock movement not found" });
    }

    const productId = product || oldMovement.product;
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 1. Reverse the old movement impact
    if (oldMovement.type === "IN") {
      existingProduct.quantity -= oldMovement.quantity;
    } else {
      existingProduct.quantity += oldMovement.quantity;
    }

    // 2. Apply new movement impact
    const newType = type || oldMovement.type;
    const newQty = quantity !== undefined ? Number(quantity) : oldMovement.quantity;

    if (newType === "IN") {
      existingProduct.quantity += newQty;
    } else {
      if (existingProduct.quantity < newQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock after adjustment. Available: ${existingProduct.quantity}`,
        });
      }
      existingProduct.quantity -= newQty;
    }

    await existingProduct.save();

    const updatedMovement = await StockMovement.findByIdAndUpdate(
      movementId,
      { product: productId, type: newType, quantity: newQty, reason: reason || oldMovement.reason, note: note || oldMovement.note, date: date || oldMovement.date },
      { new: true }
    ).populate("product", "name sku quantity");

    res.status(200).json({ success: true, data: updatedMovement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// --- DELETE /api/stock-movements/:id -----------------------------------------
export const deleteStockMovement = async (req: Request, res: Response) => {
  try {
    const movement = await StockMovement.findById(req.params.id);
    if (!movement) {
      return res.status(404).json({ success: false, message: "Stock movement not found" });
    }

    // Adjust product quantity back before deleting
    const existingProduct = await Product.findById(movement.product);
    if (existingProduct) {
      if (movement.type === "IN") {
        existingProduct.quantity -= movement.quantity;
      } else {
        existingProduct.quantity += movement.quantity;
      }
      await existingProduct.save();
    }

    await StockMovement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Stock movement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
