import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("orders-collections", OrderSchema);
