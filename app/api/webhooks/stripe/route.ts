import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json(
      { message: "Webhook error", error: err.message },
      { status: 400 },
    );
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object as any;

    const order = {
      id,
      amount: amount_total,
      address: JSON.parse(metadata),
    };

    console.log("Order created", order);

    return NextResponse.json({ message: "OK" });
  }

  return new Response("", { status: 200 });
}
