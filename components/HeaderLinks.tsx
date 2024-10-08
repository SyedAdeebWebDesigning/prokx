"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import User from "@/lib/database/models/User.model";

interface HeaderLinksProps {
  navLink: {
    name: string;
    href: string;
    isAdmin?: boolean;
  };
  clerkUser: User;
}

const HeaderLinks = ({ navLink, clerkUser }: HeaderLinksProps) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // Check if the link is active based on category query parameter
  const isActive = category
    ? navLink.href.includes(category)
    : navLink.href === "/products";

  // Check if the link is an admin link and the user is an admin
  const showLink = !navLink.isAdmin || (navLink.isAdmin && clerkUser?.isAdmin);

  return (
    <>
      {showLink && (
        <Link key={navLink.name} href={navLink.href} className="">
          <h2
            className={clsx(
              "px-4 py-2 underline-offset-4 transition-all duration-200 hover:underline",
              { "font-bold text-primary": isActive },
            )}
          >
            {navLink.name}
          </h2>
        </Link>
      )}
    </>
  );
};

export default HeaderLinks;
