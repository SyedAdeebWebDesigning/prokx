"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { formatDescription, transformDescription } from "@/lib/formatText";
import Image from "next/image";
import { toast } from "react-toastify";
import { addCart, getCart } from "@/lib/cart";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IProductDocument,
  ProductVariant,
} from "@/lib/database/models/Product.model";
import { useEffect, useState } from "react";
import { ProductSkeleton } from "./skeletons/productSkeleton";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SelectContent } from "@radix-ui/react-select";

interface ProductPageProps {
  paramsId: string;
  product: IProductDocument;
}

const ProductPage = ({ paramsId, product }: ProductPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = JSON.parse(JSON.stringify(paramsId));
  const size = searchParams.get("size") || "defaultSize";
  const color = searchParams.get("color") || "defaultColor";

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullText, setIsFullText] = useState(false);
  const [quantity] = useState(1);

  const result = JSON.parse(JSON.stringify(product));
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const initialVariant = result.product_variants.find(
          (variant: any) => variant.color_name === color,
        );
        setSelectedVariant(initialVariant || result.product_variants[0]);
        setMainImage(
          initialVariant?.images[0].url ||
            result.product_variants[0].images[0].url,
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, color]);

  if (isLoading || !product) {
    return <ProductSkeleton />;
  }

  const handleColorChange = (colorName: string) => {
    const variant = product.product_variants.find(
      (variant) => variant.color_name === colorName,
    );
    if (variant) {
      router.push(`/products/${id}?color=${variant.color_name}&size=${size}`);
      setSelectedVariant(variant);
      setMainImage(variant.images[0]?.url);
    }
  };

  const handleSizeChange = (newSize: string) => {
    router.push(
      `/products/${id}?color=${selectedVariant?.color_name}&size=${newSize}`,
    );
  };

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const selectedSize: any = selectedVariant?.sizes.find(
    (s: any) => s.size === size,
  );
  const sizeId = selectedSize?._id;
  const cartItem = getCart().items.find((c) => c.id === sizeId);

  const handleAddToCart = () => {
    if (selectedVariant) {
      const availableQty = selectedSize ? selectedSize.available_qty : 0;
      const image =
        selectedVariant.images[0]?.url ||
        product.product_variants[0].images[0]?.url;
      const currentCart = getCart();
      const currentItem = currentCart.items.find((item) => item.id === sizeId);
      if (availableQty > 0) {
        const quantityToAdd = quantity;

        if (
          quantityToAdd + (currentItem ? currentItem.quantity : 0) <=
          availableQty
        ) {
          addCart({
            id: sizeId,
            productId: product._id as string,
            name: product.product_name,
            quantity: quantityToAdd,
            size: size,
            color: color as string,
            price: product.product_price,
            availableQty: availableQty,
            image: image,
            maxQuantity: availableQty,
          });

          toast.success(`Item added to cart.`, {
            autoClose: false,
          });
        } else {
          toast.error("Not enough stock available", {
            autoClose: false,
          });
        }
      } else {
        toast.error("Selected size is not available", {
          autoClose: false,
        });
      }
    }

    window.location.reload();
  };

  const isAvailable =
    selectedVariant?.sizes.find((s) => s.size === size)?.available_qty ?? 0 > 0
      ? true
      : false;

  const productDescription = product.product_description;

  const AvailableQty =
    selectedVariant?.sizes.find((s: any) => s.size === size)?.available_qty ??
    0;

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const customSortSizes = (sizes: any[]) => {
    return sizes.sort((a, b) => {
      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
    });
  };

  const availableText =
    AvailableQty <= 4
      ? `Hurry up! Only ${AvailableQty} items left in the stock`
      : `
  ${AvailableQty} items left in the stock
  `;

  return (
    <main className="my-20">
      <section className="body-font overflow-hidden text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="mx-auto flex flex-wrap md:w-4/5">
            <div className="relative w-full md:w-1/2">
              <div className="absolute -top-20 left-0 mx-auto flex w-full justify-center space-x-2 overflow-x-scroll md:-left-20 md:top-0 md:flex-col md:space-x-0 md:space-y-2">
                {selectedVariant?.images.map((image: any) => (
                  <Button
                    key={image.url}
                    className="relative size-16 overflow-x-scroll rounded border-2 border-gray-300"
                    onClick={() => handleImageClick(image.url)}
                  >
                    <Image
                      alt="ecommerce"
                      layout="fill"
                      className="bg-white object-cover"
                      src={image.url}
                    />
                  </Button>
                ))}
              </div>
              <div className="relative h-96 w-full rounded object-center md:h-[500px]">
                <Image
                  alt="ecommerce"
                  layout="fill"
                  className="object-contain"
                  src={mainImage || "https://dummyimage.com/400x400"}
                />
              </div>
            </div>
            <div className="mt-6 w-full md:mt-0 md:w-1/2 md:py-6 md:pl-10">
              <h2 className="title-font text-sm tracking-widest text-gray-500">
                {product.product_category}
              </h2>
              <h1 className="title-font mb-1 text-3xl font-medium text-gray-900">
                {product.product_name} ({size}/{color})
              </h1>
              <div
                className={`${isFullText ? "line-clamp-none" : "line-clamp-[10]"} `}
              >
                <p
                  className="mt-2 rounded p-3"
                  dangerouslySetInnerHTML={{
                    __html: transformDescription(productDescription),
                  }}
                />
              </div>

              <Button
                variant={"ghost"}
                onClick={() => setIsFullText(!isFullText)}
              >
                {isFullText ? "Read less" : "Read more"}{" "}
              </Button>

              <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
                <div className="flex space-x-1">
                  <span className="mr-3">Color</span>
                  {product.product_variants.map((variant) => (
                    <button
                      key={variant.color_name}
                      name={variant.color_name}
                      className={`h-6 w-6 space-x-1 rounded-full border-2 ${
                        variant.color_name === selectedVariant?.color_name
                          ? "border-gray-900"
                          : "border-gray-300"
                      } focus:outline-none`}
                      style={{ backgroundColor: variant.color_hex_code }}
                      onClick={() => handleColorChange(variant.color_name)}
                    />
                  ))}
                </div>
                <div className="ml-6 flex items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <Select value={size} onValueChange={handleSizeChange}>
                      <SelectTrigger className="flex w-full appearance-none items-center rounded border border-gray-300 py-2 pl-3 pr-10 text-base outline-none">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent className="w-20 bg-gray-100">
                        <SelectGroup>
                          {customSortSizes(selectedVariant?.sizes || []).map(
                            (s: any) => (
                              <SelectItem key={s.size} value={s.size}>
                                {s.size}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex">
                <span className="title-font text-2xl font-medium text-gray-900">
                  {formatCurrency(result.product_price)}
                </span>
                <Button
                  className="ml-auto flex"
                  disabled={AvailableQty <= 0}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </div>
              <div className="flex">
                <p>{AvailableQty >= 1 ? availableText : "Out of stock"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
