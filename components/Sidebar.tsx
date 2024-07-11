"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Package2, ShoppingBasket, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
	const pathname = usePathname();
	const sideBarList = [
		{
			title: "Dashboard",
			icon: LayoutDashboard,
			href: "/dashboard",
		},
		{
			title: "Products",
			icon: ShoppingBasket,
			href: "/dashboard/products?page=1",
		},
		{
			title: "Orders",
			icon: Package2,
			href: "/dashboard/orders?page=1",
		},
		{
			title: "Users",
			icon: Users,
			href: "/dashboard/users?page=1",
		},
	];

	return (
		<div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
			<ul className="space-y-2 font-medium">
				<li>
					<Link
						href={"/"}
						className="flex items-center justify-center p-2 border-b border-gray-300">
						<Image
							src={"/logos/Logo.svg"}
							alt="logo"
							width={100}
							height={50}
							className="object-contain"
						/>
					</Link>
				</li>
				{sideBarList.map((item) => (
					<li key={item.title}>
						<Link
							href={item.href}
							className={clsx(
								"flex items-center text-gray-900 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group p-4",
								{
									"bg-gray-200 dark:bg-gray-700": pathname === item.href,
								}
							)}>
							<item.icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
							<span className="flex-1 ml-3 whitespace-nowrap line-clamp-1">
								{item.title}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
