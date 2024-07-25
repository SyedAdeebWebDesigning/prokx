import Stripe from "stripe";
import { NextResponse } from "next/server";

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
      const { id, amount_total, metadata } = event.data.object as any;

      // Construct order object from the event data
      const order = {
        id,
        amount: amount_total,
        address: JSON.parse(metadata.customer_address),
        email: metadata.customer_email,
      };

      // Log the order object for debugging
      console.log("Order created", order);

      // TODO: Handle order processing (e.g., save to database, send confirmation email, etc.)
    }

    // Return a response indicating that the event was handled successfully
    return new Response("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    // Log any errors during event handling
    console.error("Error handling event", err.message);
    return NextResponse.json(
      { message: "Event handling error", error: err.message },
      { status: 500 },
    );
  }
}
