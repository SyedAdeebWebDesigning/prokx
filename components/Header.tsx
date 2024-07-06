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
import { Menu, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import MobileNav from "./MobileNav";
interface HeaderProps {}

const Header = async ({}: HeaderProps) => {
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
		{
			name: "Mugs",
			href: "/mugs",
		},
	];
	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;
	const currentClerkUser = await currentUser();
	const clerkUser = await getUserById(currentClerkUser?.id as string);

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
					<SignedIn>
						<ul className="items-center justify-center text-gray-800 space-x-10 hidden lg:flex font-semibold">
							{navLinks.map((navLink) => (
								<HeaderLinks navLink={navLink} />
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
							<Cart />
							<div className="text-gray-400">|</div>
							<UserNav clerkUser={clerkUser} />
							<MobileNav navLinks={navLinks} />
						</SignedIn>
					</nav>
				</div>
			</MaxWidthWrapper>
		</header>
	);
};

export default Header;
