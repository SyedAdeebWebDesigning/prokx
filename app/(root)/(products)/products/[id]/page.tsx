"use client";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/actions/product.action";
import {
  IProductDocument,
  ProductVariant,
} from "@/lib/database/models/Product.model";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";
import { addCart, getCart } from "@/lib/cart";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "react-toastify";
import SlateEditor from "@/components/SlateEditor";
import { Descendant } from "slate";

interface PageProps {
  params: {
    id: string;
  };
}

const Skeleton = () => (
  <main className="my-20">
    <section className="body-font overflow-hidden text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mx-auto flex flex-wrap md:w-4/5">
          <div className="relative w-full md:w-1/2">
            <div className="absolute -top-24 left-0 flex flex-wrap space-x-2 md:-left-24 md:top-0 md:flex-col md:space-x-0 md:space-y-2">
              {Array(4)
                .fill("")
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-20 animate-pulse rounded border-2 border-gray-300 bg-gray-300"
                  ></div>
                ))}
            </div>
            <div className="relative h-96 w-full animate-pulse rounded bg-gray-300 md:h-[500px]"></div>
          </div>
          <div className="mt-6 w-full md:mt-0 md:w-1/2 md:py-6 md:pl-10">
            <div className="mb-2 h-4 w-1/4 animate-pulse bg-gray-300"></div>
            <div className="mb-4 h-8 w-3/4 animate-pulse bg-gray-300"></div>
            <div className="mb-4 h-20 w-full animate-pulse bg-gray-300"></div>
            <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
              <div className="flex space-x-1">
                <span className="mr-3">Color</span>
                {Array(5)
                  .fill("")
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="h-6 w-6 animate-pulse rounded-full border-2 border-gray-300 bg-gray-300"
                    ></div>
                  ))}
              </div>
              <div className="ml-6 flex items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <div className="h-10 w-20 animate-pulse rounded border border-gray-300 bg-gray-300"></div>
                  <span className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center text-center text-gray-600">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-1/4 animate-pulse bg-gray-300"></div>
              <div className="ml-auto h-10 w-1/4 animate-pulse bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

const Page = ({ params }: PageProps): ReactElement => {
  const searchParams = useSearchParams();
  const id = JSON.parse(JSON.stringify(params.id));
  const size = searchParams.get("size") || "defaultSize";
  const color = searchParams.get("color") || "defaultColor";

  const [product, setProduct] = useState<IProductDocument | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullText, setIsFullText] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        const result = JSON.parse(JSON.stringify(data));
        setProduct(result);
        const initialVariant = result.product_variants.find(
          (variant: any) => variant.color_name === color,
        );
        setSelectedVariant(initialVariant || result.product_variants[0]);
        setMainImage(
          initialVariant?.images[0].url ||
            result.product_variants[0].images[0].url,
        );
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, color]);

  if (isLoading || !product) {
    return <Skeleton />;
  }

  const handleColorChange = (colorName: string) => {
    const variant = product.product_variants.find(
      (variant) => variant.color_name === colorName,
    );
    window.location.href = `/products/${id}?color=${variant?.color_name}&size=${size}`;
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.href = `/products/${id}?color=${selectedVariant?.color_name}&size=${event.target.value}`;
  };

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const productQuantity = selectedVariant?.sizes.find(
    (s) => s.size === size,
  )?.available_qty;

  const handleAddToCart = () => {
    if (selectedVariant) {
      const selectedSize: any = selectedVariant.sizes.find(
        (s) => s.size === size,
      );
      const sizeId = selectedSize?._id;
      const availableQty = selectedSize ? selectedSize.available_qty : 0;
      const image =
        selectedVariant.images[0]?.url ||
        product.product_variants[0].images[0]?.url;
      const currentCart = getCart();
      const currentItem = currentCart.items.find((item) => item.id === sizeId);

      if (availableQty > 0) {
        const quantityToAdd = 1;

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

          const newTotalQuantity =
            (currentItem ? currentItem.quantity : 0) + quantityToAdd;

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

  const formatDescription = (text: string) => {
    // Split the text by newlines to handle bullet points and formatting
    const lines = text.split("\n");

    return (
      <div>
        {lines.map((line, index) => {
          // Handle bullet points
          if (line.startsWith("- ")) {
            const bulletPointText = line.replace(/^-\s*/, "• ");

            // Split the line into parts, where **text** should be bold
            const parts = bulletPointText
              .split(/(\*\*.*?\*\*)/g)
              .filter(Boolean);

            return (
              <p key={index} className="text-base">
                {parts.map((part, i) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    // Remove the ** from the text and make it bold
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  } else {
                    return <span key={i}>{part}</span>;
                  }
                })}
              </p>
            );
          }

          // Handle lines without bullet points
          return (
            <p key={index} className="text-base">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  const productDescription = product.product_description;
  

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
              <p
                className={`${isFullText ? "line-clamp-none" : "line-clamp-6"} `}
              >
                {formatDescription(
                  isFullText
                    ? productDescription
                    : productDescription.slice(0, 500),
                )}
              </p>

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
                    <select
                      value={size}
                      onChange={handleSizeChange}
                      className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2"
                    >
                      {selectedVariant?.sizes
                        .sort((a: any, b: any) => {
                          const sizeOrder = ["S", "M", "L", "XL", "XXL"];
                          return (
                            sizeOrder.indexOf(a.size) -
                            sizeOrder.indexOf(b.size)
                          );
                        })
                        .map((size: any) => (
                          <option key={size.size} value={size.size}>
                            {size.size}
                          </option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center text-center text-gray-600">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <p className={cn(!isAvailable ? "text-red-400" : "")}>
                {isAvailable ? "available" : "out of stock"}
              </p>
              <div className="flex items-center">
                <span className="title-font text-2xl font-medium text-gray-900">
                  {formatCurrency(Number(product.product_price))}
                </span>
                <Button
                  className="ml-auto flex border-0 px-6 py-2 text-white focus:outline-none"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
