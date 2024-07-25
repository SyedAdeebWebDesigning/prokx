"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

export const createStripeCheckoutSession = async (
  cartItems: any[],
  userAddress: any,
  userFullName: string,
  userEmail: string,
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  try {
    // Validate cart items
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

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        customer_address: JSON.stringify({
          street: userAddress.line1,
          city: userAddress.city,
          state: userAddress.state,
          postal_code: userAddress.postal_code,
          country: userAddress.country,
          customer_email: userEmail,
        }),
        order_details: cartItems
          .map((item) => ({
            product_id: item.product_id,
          }))
          .join(", "),
      },
      customer_email: userEmail,

      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    return session.url;
  } catch (err) {
    throw new Error("Failed to create Stripe Checkout session.");
  }
};
