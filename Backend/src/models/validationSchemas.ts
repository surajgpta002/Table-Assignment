import { Type } from "@sinclair/typebox";

export const GetTablesDataQuerySchema = Type.Object({
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
  transferAmount: Type.Optional(Type.String()),
  mdrRate: Type.Optional(Type.String()),
  businessName: Type.Optional(Type.String()),
  industryType: Type.Optional(Type.String()),
  customerUPI: Type.Optional(Type.String()),
  customerUTR: Type.Optional(Type.String()),
  orderId: Type.Optional(Type.String()),
  txnId: Type.Optional(Type.String()),
});
