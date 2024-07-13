"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import User from "@/lib/database/models/User.model";

interface NavLink {
  name: string;
  href: string;
  isAdmin?: boolean;
}

interface MobileNavProps {
  navLinks: NavLink[];
  clerkUser: User;
}

const MobileNav = ({ navLinks, clerkUser }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger aria-hidden>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col space-y-2">
            {navLinks.map((navLink) => {
              const isActive = pathname === navLink.href;

              if (navLink.isAdmin && !clerkUser.isAdmin) {
                return null;
              }

              return (
                <a key={navLink.name} href={navLink.href}>
                  <h2
                    className={clsx(
                      "rounded px-4 py-2 underline-offset-4 transition-all duration-200 hover:underline",
                      { "font-bold text-primary": isActive },
                    )}
                  >
                    {navLink.name}
                  </h2>
                </a>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
