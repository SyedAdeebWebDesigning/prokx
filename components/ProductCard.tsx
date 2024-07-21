"use client";

import { IProductDocument } from "@/lib/database/models/Product.model";
import Image from "next/image";
import { useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: IProductDocument;
  index: number;
  isNotCategorized?: boolean;
}

// Define the custom order for sizes
const sizeOrder = ["S", "M", "L", "XL", "XXL"];

const ProductCard = ({
  product,
  index,
  isNotCategorized,
}: ProductCardProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const defaultVariant = product.product_variants[0];
    const defaultSize = defaultVariant.sizes[0].size; // Assuming sizes is an array
    const defaultColor = defaultVariant.color_name; // Assuming name is available

    const url = `/products/${product._id}?size=${defaultSize}&color=${defaultColor}`;
    window.location.href = url;
  };

  // Find all available sizes and sort them according to the custom order
  const availableSizes = Array.from(
    new Set(
      product.product_variants.flatMap((variant) =>
        variant.sizes
          .filter((size) => size.available_qty > 0)
          .map((size) => size.size),
      ),
    ),
  ).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

  return (
    <div
      key={product._id as string}
      className="cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl"
      onMouseEnter={() => {
        setTimeout(() => {
          setImageIndex(1);
          setIsHovered(true);
        }, 100);
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setImageIndex(0);
          setIsHovered(false);
        }, 100);
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-80 w-full">
          <Image
            fill
            loading="lazy"
            src={product.product_variants[0].images[imageIndex].url}
            alt={`product-${index}_name-${product.product_name}`}
            className={`object-contain transition-all duration-300 ${
              isHovered ? "scale-90" : "scale-100"
            }`}
          />
        </div>
        <div className="w-full bg-gradient-to-b from-transparent to-gray-100 p-5">
          <div className="flex w-full items-center justify-between py-2">
            <div>
              {isNotCategorized && (
                <h5 className="text-sm font-medium text-muted-foreground">
                  {product.product_category}
                </h5>
              )}
              <h3 className="text-lg font-medium">{product.product_name}</h3>
            </div>
            <span className="text-md font-semibold text-muted-foreground">
              {formatCurrency(Number(product.product_price))}
            </span>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {product.product_description}
          </p>
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="flex items-center space-x-1">
              <span key={index} className="text-lg text-muted-foreground">
                {availableSizes.join(", ")}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {product.product_variants.map((variant, index) => {
                return (
                  <HoverCard key={index}>
                    <HoverCardTrigger>
                      <div
                        className="size-4 rounded-full border-2 border-gray-300"
                        style={{
                          backgroundColor: variant.color_hex_code,
                        }}
                        aria-hidden
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit rounded p-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">
                          {variant.color_name}
                        </span>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
