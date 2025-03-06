import { Type } from "@sinclair/typebox";

export const GetTablesDataQuerySchema = Type.Partial(
  Type.Object({
    page: Type.Optional(Type.String()),
    limit: Type.Optional(Type.String()),
    date_start: Type.Optional(Type.String()),
    date_end: Type.Optional(Type.String()),
    businessName: Type.Optional(Type.String()),
    industryType: Type.Optional(Type.String()),
    transferAmount: Type.Optional(Type.Number()),
    mdrRate: Type.Optional(Type.Number()),
    customerUPI: Type.Optional(Type.String()),
    customerUTR: Type.Optional(Type.String()),
    orderId: Type.Optional(Type.String()),
    txnId: Type.Optional(Type.String()),
    search: Type.Optional(Type.String()),
  })
);

export type QueryType = typeof GetTablesDataQuerySchema;
