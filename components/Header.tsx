"use client";

import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
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
			{isMounted && (
				<MaxWidthWrapper>
					<div className="flex items-center  justify-between">
						<Link
							href={"/"}
							className="relative w-[100px] md:w-[200px] h-[50px]">
							<Image
								src={"/logos/Logo.svg"}
								fill
								alt="logo"
								loading="eager"
								className=""
							/>
						</Link>
						<SignedIn>
							<ul className="items-center justify-center text-gray-800 space-x-10 hidden md:flex font-semibold">
								{navLinks.map((navLink) => (
									<Link key={navLink.name} href={navLink.href}>
										<h2 className=" hover:underline underline-offset-4 px-4 py-2 rounded transition-all duration-200">
											{navLink.name}
										</h2>
									</Link>
								))}
							</ul>
						</SignedIn>
						<nav className="flex items-center space-x-4">
							<SignedOut>
								<Link
									href={"/sign-in"}
									className="flex items-center space-x-1 hover:underline underline-offset-2 font-semibold">
									<h2>Sign in</h2>
								</Link>
							</SignedOut>

							<SignedIn>
								<div className="flex items-center space-x-1">
									<ShoppingBagIcon className="size-5" />
									<h2>Cart (0)</h2>
								</div>
								<div className="text-gray-400">|</div>
								<UserButton />
							</SignedIn>
						</nav>
					</div>
				</MaxWidthWrapper>
			)}
		</header>
	);
};

export default Header;
