"use client";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";

interface ProductHeaderProps {}

const ProductHeader = ({}: ProductHeaderProps) => {
  return (
    <header className="sticky top-0 mb-6 flex w-full justify-end bg-gray-50 py-4">
      <div className="mr-4">
        <Link href={"/admin-products/new"}>
          <Button className="rounded bg-primary text-white">Create New</Button>
        </Link>
      </div>
    </header>
  );
};

export default ProductHeader;
