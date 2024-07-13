"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package2,
  ShoppingBasket,
  Users,
  VerifiedIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "@/lib/database/models/User.model";

interface SidebarProps {
  clerkUser: User;
}

const Sidebar = ({ clerkUser }: SidebarProps) => {
  const pathname = usePathname();

  const sideBarList = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin-dashboard",
    },
    {
      title: "Products",
      icon: ShoppingBasket,
      href: "/admin-products",
    },
    {
      title: "Orders",
      icon: Package2,
      href: "/admin-orders",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin-users",
    },
  ];

  const firstLetterOfName = clerkUser?.firstName?.[0] ?? "";
  const lastLetterOfName = clerkUser?.lastName?.[0] ?? "";

  return (
    <div className="h-full overflow-y-auto bg-gray-50 px-0 py-4 dark:bg-gray-800">
      <ul className="font-medium">
        <li>
          <Link href={"/"} className="flex items-center justify-center p-2">
            <Image
              src={"/logos/Logo.svg"}
              alt="logo"
              width={100}
              height={50}
              className="object-contain"
            />
          </Link>
        </li>
        <li>
          <div
            className={clsx(
              "group flex items-center rounded bg-primary/[0.10] p-4 text-gray-900 dark:text-white dark:hover:bg-gray-700",
            )}
          >
            <Avatar className="border-4 border-primary/20">
              <AvatarImage
                src={clerkUser.photo}
                alt="user"
                className="rounded-full"
              />
              <AvatarFallback>
                {firstLetterOfName}
                {lastLetterOfName}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 line-clamp-1 flex flex-1 flex-col justify-center whitespace-nowrap">
              <p className="text-medium line-clamp-1 flex items-center text-pretty text-lg text-primary">
                {clerkUser.username}
                <span className="ml-1">
                  {" "}
                  <VerifiedIcon
                    fill={clerkUser.isOwner ? "gold" : "lightblue"}
                    className={clerkUser.isOwner ? "text-black" : "text-white"}
                  />
                </span>
              </p>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {clerkUser.email}
              </p>
            </div>
          </div>
        </li>
        <li className="my-2">
          {sideBarList.map((item) => {
            const updatedPathname = item.href.slice(
              0,
              item.href.includes("?")
                ? item.href.indexOf("?")
                : item.href.length,
            );
            return (
              <Link
                key={item.title}
                href={item.href}
                className={clsx(
                  "group flex items-center rounded p-4 text-gray-900 hover:bg-primary/[0.10] dark:text-white dark:hover:bg-gray-700",
                  {
                    "bg-primary/[0.10] dark:bg-gray-700":
                      pathname === updatedPathname ||
                      pathname.includes(updatedPathname),
                  },
                )}
              >
                <item.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="ml-3 line-clamp-3 flex-1 whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
