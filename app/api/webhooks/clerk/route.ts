import {
  createUserProps,
  deleteUser,
  updateUser,
} from "../../../../lib/actions/user.action";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { createUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  if (evt.type === "user.created") {
    console.log("Testing Started");

    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user: createUserProps = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
      hasProfileCompleted: false,
      isAdmin: false,
      isOwner: false,
    };

    const newUser = await createUser(user);
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const updateProps = {
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
    };

    const updatedUser = await updateUser(id, updateProps);

    return NextResponse.json({ message: "User updated", user: updatedUser });
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    const clerkId = id ?? "null";
    const deletedUser = await deleteUser(clerkId);

    return NextResponse.json({ message: "User deleted", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
