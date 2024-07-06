"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface HeaderLinksProps {
	navLink: {
		name: string;
		href: string;
	};
	isMobile?: boolean;
}

const HeaderLinks = ({ navLink, isMobile }: HeaderLinksProps) => {
	const pathname = usePathname();
	const isActive = pathname === navLink.href;

	return (
		<Link key={navLink.name} href={navLink.href}>
			<h2
				className={clsx(
					"hover:underline underline-offset-4 px-4 py-2 rounded transition-all duration-200",
					{ "font-bold text-primary": isActive }
				)}>
				{navLink.name}
			</h2>
		</Link>
	);
};

export default HeaderLinks;
