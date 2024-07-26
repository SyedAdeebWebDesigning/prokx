import Stripe from "stripe";
import { NextResponse } from "next/server";
import { queueOrderProcessing } from "@/lib/backgroundJob"; // Implement this
import { createOrder } from "@/lib/actions/orders.action";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  // Read the request body
  const body = await request.text();

  // Retrieve the Stripe signature from the headers
  const sig = request.headers.get("stripe-signature") as string;

  // Stripe webhook secret to verify the signature
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Verify the event by constructing it using Stripe's webhook utility
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
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
      const { id, amount_total, metadata, payment_status } = session;

      console.log("Received metadata:", metadata);

      if (!metadata.order_details) {
        throw new Error("order_details is missing in metadata");
      }

      let orderDetails;
      try {
        orderDetails = JSON.parse(metadata.order_details);
      } catch (err: any) {
        throw new Error(`Failed to parse order_details: ${err.message}`);
      }

      let address;
      try {
        address = JSON.parse(metadata.customer_address);
      } catch (err: any) {
        throw new Error(`Failed to parse customer_address: ${err.message}`);
      }

      const order = {
        paymentStatus: payment_status,
        amount: amount_total,
        userId: metadata.user_clerk_id,
        email: metadata.customer_email,
        address: address,
        items: orderDetails,
      };

      //  Queue the order processing
      try {
        await createOrder(order);
        console.log("Order processed successfully:", order);
      } catch (error) {}

      return NextResponse.json({ message: "OK", data: order });
    }

    return new Response("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Event handling error", error: err },
      { status: 500 },
    );
  }
}
