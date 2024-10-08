import Stripe from "stripe";
import { NextResponse } from "next/server";
import { queueOrderProcessing } from "@/lib/backgroundJob"; // Ensure this function is implemented correctly
import { createOrder } from "@/lib/actions/orders.action";

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
      const { amount_total, payment_status } = session;

      console.log("Received session data:", session); // Debugging log

      const metadata = session.metadata;

      // Prepare the order object
      const order = {
        userEmail: metadata.customer_email,
        orderTotal: amount_total,
        paymentStatus: payment_status,
        userId: metadata.user_clerk_id,
        orderAddress: {
          street: JSON.parse(metadata.customer_address).street,
          city: JSON.parse(metadata.customer_address).city,
          state: JSON.parse(metadata.customer_address).state,
          country: JSON.parse(metadata.customer_address).country,
          postalCode: JSON.parse(metadata.customer_address).postal_code,
        },
        items: JSON.parse(metadata.order_details).map((item: any) => ({
          product_id: item.product_id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      };

      // Log the constructed order object for verification
      console.log("Constructed order:", JSON.stringify(order, null, 2));

      // Queue the order processing
      const newOrder = await createOrder(order); // Ensure this function handles order creation in the database

      return NextResponse.json({ message: "OK", data: newOrder });
    }

    return new Response("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    console.error("Error processing event:", err);
    return NextResponse.json(
      { message: "Event handling error", error: err.message },
      { status: 500 },
    );
  }
}
