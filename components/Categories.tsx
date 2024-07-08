"use client";

import Image from "next/image";
import Heading from "./Heading";
import MaxWidthWrapper from "./MaxWidthWrapper";

interface CategoriesProps {}

const Categories = ({}: CategoriesProps) => {
	const categoriesList = [
		{
			name: "TShirts",
			image: "/images/collections-tshirts.png",
			href: "/tshirts?page=1",
			objectFit: "contain",
		},
		{
			name: "Caps",
			image: "/images/collections-caps.png",
			href: "/caps?page=1",
			objectFit: "contain",
		},
		{
			name: "Hoodies",
			image: "/images/collections-hoodies.png",
			href: "/hoodies?page=1",
			objectFit: "contain",
		},
		{
			name: "Sweatshirts",
			image: "/images/collections-sweatshirts.png",
			href: "/sweatshirts?page=1",
			objectFit: "contain",
		},
		{
			name: "Zippers",
			image: "/images/collections-zippers.png",
			href: "/zippers?page=1",
			objectFit: "contain",
		},
		{
			name: "Mugs",
			image: "/images/collections-mugs.png",
			href: "/mugs?page=1",
			objectFit: "contain",
		},
	];

	return (
		<MaxWidthWrapper>
			<Heading>Collections</Heading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
				{categoriesList.map((category) => {
					const handleClick = (href: string) => {
						setTimeout(() => {
							window.location.href = href;
						}, 1000);
					};
					return (
						<div
							onClick={() => handleClick(category.href)}
							key={category.name}
							className="rounded-lg cursor-pointer flex items-center justify-center bg-gray-100 scale-100 group hover:scale-100 transition-all duration-200 ease-in-out">
							<div className="relative w-full h-[400px] md:h-[500px] lg:h-[500px]">
								<Image
									src={category.image}
									fill
									loading="lazy"
									alt={category.name}
									objectFit={category.objectFit}
									className="rounded-lg z-10 object-center"
								/>
								<h2 className="absolute inset-0 flex items-center justify-center md:justify-center text-center uppercase text-white text-shadow-small group-hover:z-30 group-hover:opacity-100 opacity-20 text-4xl lg:text-7xl font-semibold transition-all duration-300 ease-in-out md:opacity-0 md:bottom-5  md:text-4xl md:ml-4">
									{category.name}
								</h2>
							</div>
						</div>
					);
				})}
			</div>
		</MaxWidthWrapper>
	);
};

export default Categories;
