import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
	const navLinks = [
		{
			name: "TShirts",
			href: "/tshirts",
		},
		{
			name: "Hoodies",
			href: "/hoodies",
		},
		{
			name: "Sweatshirts",
			href: "/sweatshirts",
		},
		{
			name: "Zippers",
			href: "/zipper",
		},
	];

	return (
		<header className="bg-[#ffffff] w-full border-b sticky top-0 z-50 py-2 border-gray-300 shadow-lg">
			<MaxWidthWrapper>
				<div className="flex items-center  justify-between">
					<Link href={"/"} className="relative w-[100px] md:w-[200px] h-[50px]">
						<Image
							src={"/logos/Logo.svg"}
							fill
							alt="logo"
							loading="eager"
							className=""
						/>
					</Link>
					<ul className="items-center justify-center text-gray-800 space-x-10 hidden md:flex font-semibold">
						{navLinks.map((navLink) => (
							<Link key={navLink.name} href={navLink.href}>
								<h2 className=" hover:underline underline-offset-4 px-4 py-2 rounded transition-all duration-200">
									{navLink.name}
								</h2>
							</Link>
						))}
					</ul>
					<nav className="flex items-center space-x-4">
						<div className="flex items-center space-x-1">
							<ShoppingBagIcon className="size-5" />
							<h2>Cart (0)</h2>
						</div>
						<div>|</div>
						<SignedOut>
							<Link href={"/sign-in"} className="flex items-center space-x-1">
								<h2>Sign in</h2>
							</Link>
						</SignedOut>
						<SignedIn>
							<UserButton children={<div>hi</div>} />
						</SignedIn>
					</nav>
				</div>
			</MaxWidthWrapper>
		</header>
	);
};

export default Header;
