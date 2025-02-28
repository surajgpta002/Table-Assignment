import { Type } from "@sinclair/typebox";

export const OrderSchema = Type.Object({
  orderId: Type.String({ minLength: 1 }),
  productName: Type.String({ minLength: 1 }),
  quantity: Type.Number({ minimum: 1 }),
  price: Type.Number({ minimum: 0 }),
});

export type OrderType = typeof OrderSchema;
