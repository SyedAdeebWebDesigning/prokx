import Header from "@/components/Header";
import React, { PropsWithChildren, ReactNode } from "react";

const layout = ({ children }: { children: PropsWithChildren<ReactNode> }) => {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
		</div>
	);
};

export default layout;
