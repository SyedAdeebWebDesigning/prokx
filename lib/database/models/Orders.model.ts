import { Schema, model, models } from "mongoose";

// Define the interface for the order details
interface OrderDetail {
  productId: string;
  productTitle: string;
  productPrice: number;
  productQty: number;
  productColor: string;
  productSize: string;
}

// Define the interface for the order
export interface IOrder {
  userEmail: string;
  orderTotal: number;
  paymentStatus: string;
  userId?: string;
  orderAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  orderDetails: OrderDetail[];
}

// Define the order schema
const orderSchema = new Schema<IOrder>(
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
      },
    ],
  },
  { timestamps: true },
);

// Create the order model
const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
