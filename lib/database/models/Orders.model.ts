import { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    orderTotal: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    userId: { type: String, required: false },
    orderAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    orderDetails: [
      {
        productId: { type: String, required: true },
        productTitle: { type: String, required: true },
        productPrice: { type: Number, required: true },
        productQty: { type: Number, required: true },
        productColor: { type: String, required: true },
        productSize: { type: String, required: true },
        productImage: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Order = models.Order || model("Order", orderSchema);
export default Order;

export const IOrders = typeof orderSchema;
