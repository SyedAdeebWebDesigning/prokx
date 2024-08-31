"use server";

import Stripe from "stripe";
import Order from "../database/models/Orders.model";
import { decreaseProductQuantity } from "./product.action";
import { connectToDatabase } from "../database";

/**
 * Creates a Stripe Checkout session for the user's cart.
 *
 * @param {any[]} cartItems - The items in the user's cart.
 * @param {any} userAddress - The address of the user.
 * @param {string} userClerkId - The unique identifier of the user from Clerk.
 * @param {string} userEmail - The email address of the user.
 * @returns {Promise<string>} - The URL of the created Stripe Checkout session.
 * @throws {Error} - If the checkout session creation fails.
 */
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
    const line_items = cartItems.map((item) => {
      if (!item.price || !item.name || !item.quantity) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      return {
        price_data: {
          currency: "INR",
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            description: `${item.size}, ${item.color}`,
          },
        },
        quantity: item.quantity,
      };
    });

    line_items.push({
      price_data: {
        currency: "INR",
        unit_amount: 99 * 100,
        product_data: {
          name: "Shipping Fee",
          description: "Standard shipping fee",
        },
      },
      quantity: 1,
    });

    const orderDetails = cartItems.map((item) => ({
      product_id: item.productId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    }));

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

/**
 * Creates a new order in the database.
 *
 * @param {any} order - The order data to be created.
 * @returns {Promise<void>} - A promise that resolves when the order is created.
 * @throws {Error} - If creating the order fails.
 */
export const createOrder = async (order: any): Promise<void> => {
  try {
    await connectToDatabase();
    console.log("Received order:", order);

    if (!Array.isArray(order.items)) {
      throw new Error("order.items is not an array");
    }

    for (const item of order.items) {
      console.log("Decreasing quantity for product ID:", item.product_id);
      await decreaseProductQuantity(
        item.product_id,
        item.size,
        item.color,
        item.quantity,
      );
    }

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

/**
 * Retrieves all orders from the database, sorted by creation date.
 *
 * @returns {Promise<any>} - A promise that resolves with the retrieved orders.
 */
export const getOrders = async (): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    return [];
  }
};

/**
 * Retrieves a specific order by its ID.
 *
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the retrieved order.
 * @throws {Error} - If fetching the order fails.
 */
export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId);
    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    throw new Error("Failed to fetch order");
  }
};

/**
 * Retrieves the most recent order for a specific user.
 *
 * @param {string} userClerkId - The unique identifier of the user from Clerk.
 * @returns {Promise<any>} - A promise that resolves with the most recent order.
 * @throws {Error} - If no orders are found or if fetching fails.
 */
export const getUserRecentOrder = async (userClerkId: string) => {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ userId: userClerkId })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    if (!order) {
      throw new Error("No orders found for this user");
    }

    return order;
  } catch (error) {
    console.error("Error fetching user order:", error);
    return {};
  }
};

/**
 * Updates the status of an order.
 *
 * @param {string} orderId - The ID of the order to update.
 * @param {string} orderStatus - The new status for the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order.
 * @throws {Error} - If updating the order status fails.
 */
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

/**
 * Updates the payment status of an order.
 *
 * @param {string} orderId - The ID of the order to update.
 * @param {string} paymentStatus - The new payment status for the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order.
 * @throws {Error} - If updating the payment status fails.
 */
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

/**
 * Retrieves all orders for a specific user.
 *
 * @param {string} userClerkId - The unique identifier of the user from Clerk.
 * @returns {Promise<any>} - A promise that resolves with the retrieved orders.
 * @throws {Error} - If fetching the user's orders fails.
 */
export const getOrdersByUserClerkId = async (userClerkId: string) => {
  try {
    await connectToDatabase();
    const orders = await Order.find({ userId: userClerkId }).sort({
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};
