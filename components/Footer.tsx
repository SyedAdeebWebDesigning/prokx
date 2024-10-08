import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  const footerLinks = [
    {
      heading: "Quick Links",
      links: [
        {
          name: "All Products",
          href: "/products",
        },
        {
          name: "TShirts",
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
      ],
    },
    {
      heading: "Manage Profile",
      links: [
        {
          name: "My Address",
          href: "/address?type=create",
        },
        {
          name: "My Profile",
          href: "/user-profile",
        },
      ],
    },
    {
      heading: "Other Links",
      links: [
        {
          name: "Your Orders",
          href: "/orders",
        },
      ],
    },
  ];

  return (
    <footer className="mt-10 bg-primary/[0.05]">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-around md:flex-row md:items-start">
          <Link
            href={"/"}
            className="relative mr-0 h-[50px] w-[100px] pb-20 md:w-[200px] lg:mr-40"
          >
            <Image
              src={"/logos/Logo.svg"}
              fill
              alt="logo"
              loading="eager"
              className=""
            />
          </Link>
          <div className="flex w-full flex-col items-center justify-around md:flex-row md:items-start">
            {footerLinks.map((section) => (
              <div
                key={section.heading}
                className="my-4 flex flex-col items-center justify-center space-y-2 text-center md:items-start md:justify-start"
              >
                <h2 className="text-2xl font-medium">{section.heading}</h2>
                <nav className="text-center">
                  <ul className="mx-auto flex flex-col items-center justify-center space-y-2 md:mx-0 md:items-start md:justify-start">
                    {section.links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "mx-auto mr-auto text-gray-700 md:mx-0",
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="flex h-10 w-full items-center justify-center bg-primary/[0.10] text-center">
        <h2>
          &copy; 2024 <span className="font-semibold">PROKX</span> - All Rights
          Reserved
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
