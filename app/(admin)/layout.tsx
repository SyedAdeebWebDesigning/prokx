import Sidebar from "@/components/Sidebar";
import { buttonVariants } from "@/components/ui/button";
import { getUserById } from "@/lib/actions/user.action";
import User from "@/lib/database/models/User.model";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard | PROKX",
  description:
    "Admin Dashboard for PROKX. Manage your users, products, orders, and more.",
  icons: {
    icon: ["/logos/P.svg"],
  },
};

const layout = async ({
  children,
}: {
  children: PropsWithChildren<ReactNode>;
}) => {
  const user = await currentUser();
  const clerkUser: User = await getUserById(user?.id || "");
  const isAdmin = clerkUser?.isAdmin;

  if (!isAdmin) {
    // 
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-center text-5xl font-semibold">
          Unauthorize Access!
        </h1>
        <p className="text-lg text-muted-foreground">
          It seems that you are not an admin. This page can only be accessed by
          admins.
        </p>
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Go to homepage
        </Link>
      </div>
    );
  }
  return (
    <div className="grid h-screen grid-cols-1 sm:grid-cols-[20%_80%]">
      <aside className="hidden bg-gray-200 sm:block">
        <Sidebar clerkUser={clerkUser} />
      </aside>
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
};

export default layout;
