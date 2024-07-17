"use client";

import { useState } from "react";
import type { IProductDocument } from "@/lib/database/models/Product.model";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "./ui/input";

interface ProductsTableProps {
  products: IProductDocument[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      String(product._id).toLowerCase().includes(query) ||
      product.product_name.toLowerCase().includes(query) ||
      (product.product_category &&
        product.product_category.toLowerCase().includes(query))
    );
  });

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
      <div className="mb-4 flex w-full items-center justify-center">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, Name, or Category"
          className="mx-2 bg-slate-50/60"
        />
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
          {filteredProducts.map((product, index) => (
            <TableRow
              onClick={() => {
                window.location.href = `/admin-products/${product._id}`;
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
                <p className="line-clamp-2">{product.product_description}</p>
              </TableCell>
              <TableCell className="text-right">
                ₹{product.product_price}/-
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
