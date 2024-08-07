"use client";

import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import type { IProductDocument } from "@/lib/database/models/Product.model";
import { Button } from "./ui/button";
import Link from "next/link";
import
  {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "./ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductsTableProps {
  products: IProductDocument[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] =
    useState<IProductDocument[]>(products);

  const debouncedFilterProducts = useMemo(
    () =>
      debounce((query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = products.filter((product) => {
          return (
            String(product._id).toLowerCase().includes(lowercasedQuery) ||
            product.product_name.toLowerCase().includes(lowercasedQuery) ||
            (product.product_category &&
              product.product_category.toLowerCase().includes(lowercasedQuery))
          );
        });
        setFilteredProducts(filtered);
      }, 300), // Adjust the debounce delay as needed
    [products],
  );

  useEffect(() => {
    debouncedFilterProducts(searchQuery);
    return () => {
      debouncedFilterProducts.cancel();
    };
  }, [searchQuery, debouncedFilterProducts]);

  if (products.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl">No products found</h1>
        <Link href={"/admin-products/new"} className="">
          <Button className="rounded">
            <span>Create a new product</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <div className="relative w-full">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Name, or Category"
            className="relative mx-2 bg-slate-50/60 pl-10"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>
      </div>
      <Table>
        <TableCaption>A list of products.</TableCaption>
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead className="">S.No</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product, index) => {
            return (
              <TableRow
                onClick={() => {
                  router.push(`/admin-products/${product._id}`);
                }}
                key={String(product._id)}
                className={cn(
                  "cursor-pointer hover:bg-transparent",
                  index % 2 !== 0 ? "bg-slate-100 hover:bg-slate-100" : "",
                )}
              >
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell className="">{String(product._id)}</TableCell>
                <TableCell className="">
                  <Image
                    src={product.product_variants[0].images[0].url}
                    alt=""
                    width={64}
                    height={64}
                  />
                </TableCell>
                <TableCell className="">{product.product_name}</TableCell>
                <TableCell className="">{product.product_category}</TableCell>
                <TableCell className="w-[50%]">
                  <p className="line-clamp-2">
                    {product.product_description
                      .replaceAll("**", "")
                      .replaceAll("-", "")}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(product.product_price))}/-
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
