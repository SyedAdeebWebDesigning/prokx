import Stripe from "stripe";
import { NextResponse } from "next/server";
import { queueOrderProcessing } from "@/lib/backgroundJob"; // Ensure this function is implemented correctly

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("Received event:", event); // Debugging log
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { message: "Webhook error", error: err.message },
      { status: 400 },
    );
  }

  const eventType = event.type;

  try {
    if (eventType === "checkout.session.completed") {
      const session = event.data.object as any;
      const { amount_total, metadata, payment_status } = session;

      console.log("Received metadata:", metadata);

      if (!metadata.order_details) {
        throw new Error("order_details is missing in metadata");
      }

      const orderDetails = JSON.parse(metadata.order_details);
      const address = JSON.parse(metadata.customer_address);

      // Prepare the order object
      const order = {
        userEmail: metadata.customer_email,
        orderTotal: amount_total,
        paymentStatus: payment_status,
        userId: metadata.user_clerk_id,
        orderAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postal_code,
        },
        orderDetails: orderDetails.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      };

      // Queue the order processing
      queueOrderProcessing(order); // Ensure this function handles order creation in the database

      return NextResponse.json({ message: "OK", data: order });
    }

    return new Response("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    console.error("Error processing event:", err);
    return NextResponse.json(
      { message: "Event handling error", error: err },
      { status: 500 },
    );
  }
}
