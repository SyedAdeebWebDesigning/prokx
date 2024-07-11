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
					href: "/products?page=1",
				},
				{
					name: "TShirts",
					href: "/tshirts?page=1",
				},
				{
					name: "Hoodies",
					href: "/hoodies?page=1",
				},
				{
					name: "Sweatshirts",
					href: "/sweatshirts?page=1",
				},
				{
					name: "Zippers",
					href: "/zippers?page=1",
				},
				{
					name: "Mugs",
					href: "/mugs?page=1",
				},
				{
					name: "Caps",
					href: "/caps?page=1",
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
					href: "/orders?page=1",
				},
			],
		},
	];

	return (
		<footer className="mt-10 bg-primary/[0.05]">
			<MaxWidthWrapper>
				<div className="flex justify-around flex-col md:flex-row items-center md:items-start">
					<Link
						href={"/"}
						className="relative w-[100px] md:w-[200px] h-[50px] pb-20 lg:mr-40 mr-0">
						<Image
							src={"/logos/Logo.svg"}
							fill
							alt="logo"
							loading="eager"
							className=""
						/>
					</Link>
					<div className="flex justify-around items-center md:items-start w-full flex-col md:flex-row">
						{footerLinks.map((section) => (
							<div
								key={section.heading}
								className="space-y-2 my-4 text-center flex flex-col items-center justify-center md:justify-start md:items-start">
								<h2 className="text-2xl font-medium">{section.heading}</h2>
								<nav className="text-center">
									<ul className="flex flex-col space-y-2 items-center justify-center mx-auto md:mx-0 md:justify-start md:items-start">
										{section.links.map((link) => (
											<Link
												key={link.name}
												href={link.href}
												className={cn(
													buttonVariants({ variant: "link" }),
													"text-gray-700 mr-auto  mx-auto md:mx-0"
												)}>
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
			<div className="w-full bg-primary/[0.10] text-center h-10 flex items-center justify-center">
				<h2>
					&copy; 2024 <span className="font-semibold">PROKX</span> - All Rights
					Reserved
				</h2>
			</div>
		</footer>
	);
};

export default Footer;
