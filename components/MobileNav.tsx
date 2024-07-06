"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

interface MobileNavProps {
	navLinks: any;
}

const MobileNav = ({ navLinks }: MobileNavProps) => {
	const pathname = usePathname();
	return (
		<div className="lg:hidden">
			<Sheet>
				<SheetTrigger aria-hidden>
					<Menu />
				</SheetTrigger>
				<SheetContent>
					<div className="flex flex-col space-y-2">
						{navLinks.map((navLink: any) => {
							const isActive = pathname === navLink.href;
							return (
								<a key={navLink.name} href={navLink.href}>
									<h2
										className={clsx(
											"hover:underline underline-offset-4 px-4 py-2 rounded transition-all duration-200",
											{ "font-bold text-primary": isActive }
										)}>
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
