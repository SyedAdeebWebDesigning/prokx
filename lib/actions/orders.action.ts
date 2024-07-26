"use server";

import Stripe from "stripe";
import Product from "../database/models/Product.model";
import Order from "../database/models/Orders.model";

interface CreateOrderProps {
  id?: string;
  paymentStatus: string;
  amount: number;
  email: string;
  userId: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: [
    {
      product_id: string;
      name: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
    },
  ];
}

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
      product_id: item.id,
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
    throw new Error("Failed to create Stripe Checkout session.");
  }
};

export const createOrder = async (order: CreateOrderProps): Promise<void> => {
  try {
    // Iterate through each item in the order
    for (const item of order.items) {
      // Find the product by product ID
      const product = await Product.findById(item.product_id);

      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      // Find the specific variant by size and color
      const variant = product.product_variants.find((variant: any) => {
        return (
          variant.color_name === item.color &&
          variant.sizes.some((s: any) => s.size === item.size)
        );
      });

      if (!variant) {
        throw new Error(`Variant not found for product: ${item.product_id}`);
      }

      // Find the size object within the variant
      const sizeObj = variant.sizes.find((s: any) => s.size === item.size);

      if (!sizeObj) {
        throw new Error(`Size not found for product: ${item.product_id}`);
      }

      // Check if there is enough quantity to decrement
      if (sizeObj.available_qty < item.quantity) {
        throw new Error(
          `Not enough quantity available for product: ${item.product_id}`,
        );
      }

      // Decrease the available quantity
      sizeObj.available_qty -= item.quantity;
    }

    // Save all changes to the product document
    await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product_id);
        return product?.save();
      }),
    );

    // Create and save the order in the orders collection
    const newOrder = new Order({
      id: order.id,
      paymentStatus: order.paymentStatus,
      amount: order.amount,
      email: order.email,
      userId: order.userId,
      address: order.address,
      items: order.items,
    });

    await newOrder.save();
  } catch (error: any) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};
