"use client";

import type { IProductDocument } from "@/lib/database/models/Product.model";
import { Button } from "./ui/button";
import Link from "next/link";

interface ProductsTableProps {
  products: IProductDocument[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
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
  return <div></div>;
};

export default ProductsTable;
