"use client";

import { useSearchParams } from "next/navigation";
import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { getPublishableProducts } from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";
import { useEffect, useState, useMemo } from "react";

interface ProductsPageProps {}

const ProductsPage = ({}: ProductsPageProps) => {
  const [products, setProducts] = useState<IProductDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(8); // Start with a limit of 8
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getPublishableProducts(1, limit); // Adjusted to use limit
        const productsData: IProductDocument[] = JSON.parse(
          JSON.stringify(data),
        );

        setProducts(productsData);

        // Check if there are more products to load
        if (productsData.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit, category]);

  const filteredProducts = useMemo(
    () =>
      category
        ? products.filter(
            (product: IProductDocument) =>
              product.product_category!.toLowerCase() ===
              category.toLowerCase(),
          )
        : products,
    [products, category],
  );

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setLimit((prevLimit) => prevLimit + 8); // Increment limit by 8
    }
  };

  if (isLoading && limit === 8) {
    return (
      <main className="my-20">
        <Heading>{category || "Products"} Collections</Heading>
        <MaxWidthWrapper>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </section>
        </MaxWidthWrapper>
      </main>
    );
  }

  if (filteredProducts.length === 0) {
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
          {filteredProducts.map((product: IProductDocument, index: number) => (
            <ProductCard
              key={product.id}
              index={index}
              product={product}
              isNotCategorized
            />
          ))}
        </section>
        {hasMore && !isLoading && (
          <button
            onClick={loadMore}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Load More
          </button>
        )}
      </MaxWidthWrapper>
    </main>
  );
};

export default ProductsPage;
