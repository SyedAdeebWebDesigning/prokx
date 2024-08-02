"use server";

import Stripe from "stripe";
import Product from "../database/models/Product.model";
import Order from "../database/models/Orders.model";
import { decreaseProductQuantity } from "./product.action";
import { connectToDatabase } from "../database";

export const createStripeCheckoutSession = async (
  cartItems: any[],
  userAddress: any,
  userClerkId: string,
  userEmail: string,
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  try {
    // Validate cart items and construct line_items array
    const line_items = cartItems.map((item) => {
      if (!item.price || !item.name || !item.quantity) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      return {
        price_data: {
          currency: "INR",
          unit_amount: item.price * 100, // Stripe expects amount in cents
          product_data: {
            name: item.name,
            description: `${item.size}, ${item.color}`, // Optional description
          },
        },
        quantity: item.quantity,
      };
    });

    // Add shipping fee
    line_items.push({
      price_data: {
        currency: "INR",
        unit_amount: 99 * 100, // ₹99 shipping fee in cents
        product_data: {
          name: "Shipping Fee",
          description: "Standard shipping fee", // Optional description
        },
      },
      quantity: 1,
    });

    // Construct metadata order details
    const orderDetails = cartItems.map((item) => ({
      product_id: item.productId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: {
        customer_address: JSON.stringify({
          street: userAddress.street,
          city: userAddress.city,
          state: userAddress.state,
          postal_code: userAddress.postalCode,
          country: userAddress.country,
        }),
        user_clerk_id: userClerkId,
        customer_email: userEmail,
        order_details: JSON.stringify(orderDetails),
      },
      customer_email: userEmail,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    return session.url;
  } catch (err) {
    console.error("Error creating Stripe Checkout session:", err);
    throw new Error("Failed to create Stripe Checkout session.");
  }
};

export const createOrder = async (order: any): Promise<void> => {
  try {
    await connectToDatabase();
    console.log("Received order:", order); // Debugging: log the order received

    // Ensure order.items is defined and is an array
    if (!Array.isArray(order.items)) {
      throw new Error("order.items is not an array");
    }

    // Iterate through each item in the order
    for (const item of order.items) {
      console.log("Decreasing quantity for product ID:", item.product_id); // Debugging
      await decreaseProductQuantity(
        item.product_id,
        item.size,
        item.color,
        item.quantity,
      );
    }

    // Create and save the order in the orders collection
    const newOrder = {
      userEmail: order.userEmail,
      orderTotal: order.orderTotal,
      paymentStatus: order.paymentStatus,
      orderStatus: "Order Placed",
      userId: order.userId,
      orderAddress: order.orderAddress,
      orderDetails: order.items.map((item: any) => ({
        productId: item.product_id,
        productTitle: item.product_name,
        productPrice: item.product_price,
        productQty: item.quantity,
        productColor: item.color,
        productSize: item.size,
      })),
    };

    const data = await Order.create(newOrder);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

export const getOrders = async (): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    return {};
  }
};

export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId);
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    throw new Error("Failed to fetch order");
  }
};

export const getUserRecentOrder = async (userClerkId: string) => {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ userId: userClerkId })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean(); // Use lean() for better performance

    if (!order) {
      throw new Error("No orders found for this user");
    }

    return order; // lean() returns plain JavaScript objects
  } catch (error) {
    console.error("Error fetching user order:", error);
    return {};
  }
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string,
): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true },
    );
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    throw new Error("Failed to update order status");
  }
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string,
): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true },
    );
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    throw new Error("Failed to update payment status");
  }
};
