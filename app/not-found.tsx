import Header from "@/components/Header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const NotFound = () => {
	return (
		<main>
			<Header />
			<div className="flex min-h-[80vh] items-center justify-center flex-col">
				<h1 className="text-7xl font-medium">404</h1>
				<p>
					It looks like the page you searched for has not been created or
					doesn't exist.
				</p>
				<Link
					href={"/"}
					className={cn("text-4xl", buttonVariants({ variant: "link" }))}>
					Go to homepage
				</Link>
			</div>
		</main>
	);
};

export default NotFound;
