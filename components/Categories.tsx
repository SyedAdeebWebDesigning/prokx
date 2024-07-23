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
      href: "/tshirts",
      objectFit: "contain",
    },
    {
      name: "Caps",
      image: "/images/collections-caps.png",
      href: "/caps",
      objectFit: "contain",
    },
    {
      name: "Hoodies",
      image: "/images/collections-hoodies.png",
      href: "/hoodies",
      objectFit: "contain",
    },
    {
      name: "Sweatshirts",
      image: "/images/collections-sweatshirts.png",
      href: "/sweatshirts",
      objectFit: "contain",
    },
    {
      name: "Zippers",
      image: "/images/collections-zippers.png",
      href: "/zippers",
      objectFit: "contain",
    },
    {
      name: "Mugs",
      image: "/images/collections-mugs.png",
      href: "/mugs",
      objectFit: "contain",
    },
  ];

  return (
    <MaxWidthWrapper>
      <Heading>Collections</Heading>
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoriesList.map((category, i) => {
          const handleClick = (href: string) => {
            window.location.href = href;
          };
          return (
            <div
              onClick={() => handleClick(category.href)}
              key={category.name}
              className="no-scrollbar group z-30 flex scale-100 cursor-pointer items-center justify-center overflow-hidden rounded bg-gray-100/50 transition-all duration-200 ease-in-out hover:scale-100"
            >
              <div className="relative h-[400px] w-full md:h-[500px] lg:h-[500px]">
                <Image
                  src={category.image}
                  fill
                  loading="lazy"
                  alt={category.name}
                  objectFit={category.objectFit}
                  className="z-20 rounded"
                />
                <h2
                  className={`text-shadow-sm group-hover:text-shadow-small no-scrollbar absolute inset-0 z-0 flex items-center justify-center text-center font-semibold uppercase text-white opacity-20 transition-all duration-500 ease-in-out group-hover:z-30 group-hover:rotate-0 group-hover:text-7xl group-hover:text-white group-hover:opacity-100 md:bottom-5 md:ml-4 md:justify-center md:text-4xl lg:overflow-auto lg:text-7xl lg:text-[100rem] ${
                    category.name === "Mugs" && "lg:mr-7"
                  }`}
                >
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
