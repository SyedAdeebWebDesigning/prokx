"use client";

import { useSearchParams } from "next/navigation";
import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton"; // Import the Skeleton component
import { getPublishableProducts } from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";
import { useEffect, useState } from "react";

interface productsPageProps {}

const productsPage = ({}: productsPageProps) => {
  const [products, setProducts] = useState<IProductDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const data = await getPublishableProducts();
      const productsData: IProductDocument[] = JSON.parse(JSON.stringify(data));

      // Filter products based on category
      const filteredProducts = category
        ? productsData.filter(
            (product: IProductDocument) =>
              product.product_category!.toLowerCase() ===
              category.toLowerCase(),
          )
        : productsData;

      setProducts(filteredProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, [category]);

  if (isLoading) {
    return (
      <main className="my-20">
        <Heading>{category || "Products"} Collections</Heading>
        <MaxWidthWrapper>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} /> // Use the Skeleton component
            ))}
          </section>
        </MaxWidthWrapper>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">No products found</h1>
      </div>
    );
  }

  return (
    <main className="my-20">
      <Heading>{category || "Products"} Collections</Heading>
      <MaxWidthWrapper>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: IProductDocument, index: number) => {
            return (
              <ProductCard index={index} product={product} isNotCategorized />
            );
          })}
        </section>
      </MaxWidthWrapper>
    </main>
  );
};

export default productsPage;
