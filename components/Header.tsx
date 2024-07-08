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
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

interface HeaderProps {}

const Header = async ({}: HeaderProps) => {
	const navLinks = [
		{
			name: "Products",
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
			href: "/zipper?page=1",
		},
		{
			name: "Mugs",
			href: "/mugs?page=1",
		},
		{
			name: "Caps",
			href: "/caps?page=1",
		},
		{
			name: "Orders",
			href: "/orders?page=1",
		},
		{
			name: "Dashboard",
			href: "/dashboard",
			isAdmin: true,
		},
	];
	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;
	const currentClerkUser = await currentUser();
	const clerkUser = await getUserById(currentClerkUser?.id as string);

	return (
		<header className="bg-[#ffffff] w-full border-b sticky top-0 z-50 py-2 border-gray-300 shadow-lg h-16 items-center">
			<MaxWidthWrapper>
				<div className="flex items-center justify-between -mt-5">
					<div className="flex space-x-2 items-center">
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
							<div className="hidden md:flex">
								<NavigationMenu>
									<NavigationMenuList>
										<NavigationMenuItem>
											<NavigationMenuTrigger>Products</NavigationMenuTrigger>
											<NavigationMenuContent>
												<NavigationMenuLink>
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
								className="flex items-center space-x-1 hover:underline underline-offset-2 font-semibold">
								<h2>Sign in</h2>
							</Link>
						</SignedOut>

						<SignedIn>
							<Cart />
							<div className="text-gray-400">|</div>
							<UserNav clerkUser={clerkUser} />
							<MobileNav navLinks={navLinks} clerkUser={clerkUser} />
						</SignedIn>
					</nav>
				</div>
			</MaxWidthWrapper>
		</header>
	);
};

export default Header;
