import mongoose, { Document, Schema } from "mongoose";

export type MovementType = "IN" | "OUT";
export type MovementReason = "purchase" | "sale" | "damaged" | "returned";

export interface IStockMovement extends Document {
  product: mongoose.Types.ObjectId;
  type: MovementType;
  quantity: number;
  reason: MovementReason;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", // links to Product model
      required: [true, "Product is required"],
    },
    type: {
      type: String,
      enum: ["IN", "OUT"], // only these two values allowed
      required: [true, "Movement type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    reason: {
      type: String,
      enum: ["purchase", "sale", "damaged", "returned"],
      required: [true, "Reason is required"],
    },
    note: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StockMovement || 
  mongoose.model<IStockMovement>("StockMovement", StockMovementSchema);