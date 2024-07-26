import Stripe from "stripe";
import { NextResponse } from "next/server";
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
    // Log and return error response if the event verification fails
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { message: "Webhook error", error: err.message },
      { status: 400 },
    );
  }

  // Handle the event type
  const eventType = event.type;

  try {
    // Handle checkout session completion
    if (eventType === "checkout.session.completed") {
      const session = event.data.object as any;
      const { id, amount_total, metadata, payment_status } = session;

      // Log the metadata to check its content
      console.log("Received metadata:", metadata);

      // Check if order_details exists in metadata
      if (!metadata.order_details) {
        throw new Error("order_details is missing in metadata");
      }

      // Parse the order details from metadata
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

      // Construct order object from the event data
      const order = {
        id,
        paymentStatus: payment_status,
        amount: amount_total,
        userId: metadata.user_clerk_id,
        email: metadata.customer_email,
        address: address,
        items: orderDetails,
      };

      // Create the order in your database
      await createOrder(order);

      // Return the order in the response
      return NextResponse.json({ message: "Order created", order });
    }

    // Return a response indicating that the event was handled successfully
    return new Response("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    console.error("Error handling the event:", err.message);
    return NextResponse.json(
      { message: "Event handling error", error: err.message },
      { status: 500 },
    );
  }
}
