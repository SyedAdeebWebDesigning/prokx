"use server";

import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { auth, currentUser } from "@clerk/nextjs/server";
import UserNav from "./UserNav";
import HeaderLinks from "./HeaderLinks";
import Cart from "./Cart";
import MobileNav from "./MobileNav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface HeaderProps {}

const Header = async ({}: HeaderProps) => {
  const navLinks = [
    {
      name: "Products",
      href: "/products",
    },
    {
      name: "T-Shirt",
      href: "/products?category=T-Shirt",
    },
    {
      name: "Hoodies",
      href: "/products?category=Hoodies",
    },
    {
      name: "Sweatshirts",
      href: "/products?category=Sweatshirts",
    },
    {
      name: "Zippers",
      href: "/products?category=Zippers",
    },
    {
      name: "Mugs",
      href: "/products?category=Mugs",
    },
    {
      name: "Caps",
      href: "/products?category=Caps",
    },
    {
      name: "Orders",
      href: "/orders",
    },
    {
      name: "Dashboard",
      href: "/admin-dashboard",
      isAdmin: true,
    },
  ];

  const currentClerkUser = await currentUser();
  const clerkUser = await getUserById(currentClerkUser?.id as string);

  return (
    <header className="fixed top-0 z-50 h-16 w-full items-center bg-white/10 py-2 shadow-lg backdrop-blur-2xl">
      <MaxWidthWrapper>
        <div className="-mt-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href={"/"}
              className="relative h-[50px] w-[100px] md:w-[200px]"
            >
              <Image
                src={"/logos/PROK.png"}
                fill
                alt="logo"
                loading="eager"
                className="object-contain"
              />
            </Link>
            <SignedIn>
              <div className="hidden md:flex">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
                        Products
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="">
                        <NavigationMenuLink className="">
                          <ul className="">
                            {navLinks.slice(0, 7).map((navLink) => (
                              <HeaderLinks
                                navLink={navLink}
                                key={navLink.name}
                                clerkUser={clerkUser}
                              />
                            ))}
                          </ul>
                        </NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                {navLinks.slice(7).map((navLink) => {
                  return (
                    <HeaderLinks
                      navLink={navLink}
                      key={navLink.name}
                      clerkUser={clerkUser}
                    />
                  );
                })}
              </div>
            </SignedIn>
          </div>
          <nav className="flex items-center space-x-4">
            <SignedOut>
              <Link
                href={"/sign-in"}
                className="flex items-center space-x-1 font-semibold underline-offset-2 hover:underline"
              >
                <h2>Sign in</h2>
              </Link>
            </SignedOut>

            <SignedIn>
              <Cart
                userClerkId={currentClerkUser?.id as string}
                clerkUser={currentClerkUser?.id as string}
                userEmail={
                  currentClerkUser?.emailAddresses[0].emailAddress as string
                }
              />
              <div className="text-gray-400">|</div>
              <UserNav clerkUser={clerkUser} />
              <div className="mt-2">
                <MobileNav navLinks={navLinks} clerkUser={clerkUser} />
              </div>
            </SignedIn>
          </nav>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
