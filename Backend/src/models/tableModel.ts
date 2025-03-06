import mongoose, { Schema, Document } from "mongoose";

export interface ITable extends Document {
  date: Date;
  businessName: string;
  industryType: string;
  transferAmount: number;
  customerUPI: string;
  customerUTR: string;
  orderId: string;
  txnId: string;
  mdrRate: number;
}

const TableSchema = new Schema<ITable>(
  {
    date: { type: Date, required: true },
    businessName: { type: String, required: true },
    industryType: { type: String, required: true },
    transferAmount: { type: Number, required: true },
    customerUPI: { type: String, required: true },
    customerUTR: { type: String, required: true },
    orderId: { type: String, required: true, index: true },
    txnId: { type: String, required: true },
    mdrRate: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Table = mongoose.model<ITable>("table-collections", TableSchema);
