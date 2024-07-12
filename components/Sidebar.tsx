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
			href: "/admin-products?page=1",
		},
		{
			title: "Orders",
			icon: Package2,
			href: "/admin-orders?page=1",
		},
		{
			title: "Users",
			icon: Users,
			href: "/admin-users?page=1",
		},
	];

	const firstLetterOfName = clerkUser?.firstName?.[0] ?? "";
	const lastLetterOfName = clerkUser?.lastName?.[0] ?? "";

	return (
		<div className="h-full px-0 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
			<ul className="font-medium">
				<li>
					<Link href={"/"} className="flex items-center justify-center p-2 ">
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
							"flex items-center text-gray-900 rounded dark:text-white bg-primary/[0.10] dark:hover:bg-gray-700 group p-4"
						)}>
						<Avatar className="border-4 border-primary/20 ">
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
						<div className="flex-1 ml-3 whitespace-nowrap line-clamp-1 flex flex-col justify-center">
							<p className="text-medium line-clamp-1 text-pretty text-primary text-lg flex items-center">
								{clerkUser.username}
								<span className="ml-1">
									{" "}
									<VerifiedIcon
										fill={clerkUser.isOwner ? "gold" : "lightblue"}
										className={clerkUser.isOwner ? "text-black" : "text-white"}
									/>
								</span>
							</p>
							<p className="text-sm text-muted-foreground line-clamp-1">
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
								: item.href.length
						);
						return (
							<Link
								key={item.title}
								href={item.href}
								className={clsx(
									"flex items-center text-gray-900 rounded dark:text-white hover:bg-primary/[0.10] dark:hover:bg-gray-700 group p-4",
									{
										"bg-primary/[0.10] dark:bg-gray-700":
											pathname === updatedPathname ||
											pathname.includes(updatedPathname),
									}
								)}>
								<item.icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
								<span className="flex-1 ml-3 whitespace-nowrap line-clamp-3">
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
