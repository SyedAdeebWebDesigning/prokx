"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ColorResult, SketchPicker } from "react-color";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProductDocument } from "@/lib/database/models/Product.model";
import { toast } from "react-toastify";
import {
  CreateProductData,
  createProduct,
  updateProduct,
  publishProduct,
  unpublishProduct,
} from "@/lib/actions/product.action";
import { IndianRupee } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { formatDescription, transformDescription } from "@/lib/formatText";

interface Size {
  size: string;
  available_qty: number;
}

interface Image {
  url: string;
  file?: File;
}

interface Variant {
  color_name: string;
  color_hex_code: string;
  images: Image[];
  sizes: Size[];
}

const ProductForm = ({
  type,
  product,
}: {
  type: "create" | "update";
  product?: IProductDocument;
}) => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState<number | string | any>("");
  const [productCategory, setProductCategory] = useState<string | any>("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  useEffect(() => {
    if (type === "update" && product) {
      try {
        setProductName(product.product_name);
        setProductDescription(product.product_description);
        setProductPrice(product.product_price);
        setProductCategory(
          product.product_category && product.product_category,
        );
        setVariants(product.product_variants);
        setIsPublished(product.isPublished || false);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  }, [type, product]);

  const addVariant = () => {
    setVariants([
      {
        color_name: "",
        color_hex_code: "",
        images: [],
        sizes: [{ size: "", available_qty: 1 }],
      },
      ...variants,
    ]);
  };

  const updateVariant = (index: number, updatedVariant: Partial<Variant>) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], ...updatedVariant };
    setVariants(updatedVariants);
  };

  const addSize = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({ size: "", available_qty: 1 });
    setVariants(updatedVariants);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number,
  ) => {
    const files = e.target.files;
    if (files) {
      const updatedVariants = [...variants];
      const updatedImages: Image[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            updatedImages.push({ url: event.target.result });
            updatedVariants[variantIndex].images = updatedImages;
            setVariants(updatedVariants);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleColorChange = (color: ColorResult, index: number) => {
    const updatedVariants = [...variants];
    updatedVariants[index].color_hex_code = color.hex;
    setVariants(updatedVariants);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const data: CreateProductData = {
        product_name: productName,
        product_description: productDescription,
        product_price: parseFloat(productPrice),
        product_category: productCategory,
        product_variants: variants.map((variant) => ({
          color_name: variant.color_name,
          color_hex_code: variant.color_hex_code,
          images: variant.images.map((image) => ({
            url: image.url,
          })),
          sizes: variant.sizes.map((size) => ({
            size: size.size,
            available_qty: size.available_qty,
          })),
        })),
        isPublished: isPublished,
      };

      if (type === "create") {
        await createProduct(data);
        toast.success(
          "Product created successfully. You need to publish the product",
        );
        setTimeout(() => {
          router.push("/admin-products");
        }, 1500);
      } else if (type === "update" && product) {
        await updateProduct(String(product._id), data);
        toast.success("Product updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!product) return;
    setIsPublishing(true);
    try {
      await publishProduct(String(product._id));
      setIsPublished(true);
      toast.success("Product published successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPublishing(false);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  };

  const handleUnPublish = async () => {
    if (!product) return;
    setIsPublishing(true);
    try {
      await unpublishProduct(String(product._id));
      setIsPublished(false);
      toast.success("Product unpublished successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPublishing(false);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  };

  const ProductCategories = [
    "T-Shirt",
    "Hoodies",
    "Sweatshirts",
    "Zippers",
    "Caps",
    "Mugs",
  ];

  const SizeOptions = ["S", "M", "L", "XL", "XXL"];

  const isFormValid =
    productName.trim() !== "" &&
    productDescription.trim() !== "" &&
    productPrice !== "" &&
    productCategory !== "" &&
    variants.length > 0 &&
    variants.every(
      (variant) =>
        variant.color_name.trim() !== "" &&
        variant.color_hex_code.trim() !== "" &&
        variant.sizes.length > 0,
    );

  if (isLoading && type === "update") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 p-4">
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Name
        </Label>
        <Input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Description
        </Label>
        <Textarea
          value={productDescription}
          rows={7}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Product Description"
          className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        <div
          className="mt-2 resize-y overflow-auto rounded border border-gray-300 p-3"
          style={{ maxHeight: "300px" }}
          dangerouslySetInnerHTML={{
            __html: transformDescription(productDescription),
          }}
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Price
        </Label>
        <div className="relative">
          <Input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Product Price"
            className="block w-full rounded border border-gray-300 px-3 py-2 pl-7 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          <IndianRupee className="absolute left-2 top-1/2 size-5 -translate-y-1/2 transform text-sm font-semibold text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Category
        </Label>
        <Select
          value={productCategory}
          onValueChange={setProductCategory}
          defaultValue={productCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {ProductCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <Label className="block text-sm font-medium text-gray-700">
          Variants
        </Label>
        {variants.map((variant, index) => (
          <div key={index} className="mb-4 rounded border p-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Color Name
              </Label>
              <Input
                type="text"
                value={variant.color_name}
                onChange={(e) =>
                  updateVariant(index, { color_name: e.target.value })
                }
                placeholder="Color Name"
                className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div className="flex flex-col items-center justify-center space-x-0 space-y-2">
              <Label className="my-2 block text-sm font-medium text-gray-700">
                Color Hex Code
              </Label>
              <SketchPicker
                color={variant.color_hex_code}
                onChange={(color) => handleColorChange(color, index)}
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Images
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
                className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <div className="flex space-x-4">
                {variant.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative">
                    <Image
                      src={image.url}
                      alt={`Variant ${index} Image ${imgIndex}`}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Sizes
              </Label>
              {variant.sizes.map((size, sizeIndex) => (
                <div key={sizeIndex} className="flex space-x-2">
                  <Select
                    value={size.size}
                    onValueChange={(value) => {
                      const updatedSizes = [...variant.sizes];
                      updatedSizes[sizeIndex].size = value;
                      updateVariant(index, { sizes: updatedSizes });
                    }}
                    defaultValue={size.size}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SizeOptions.map((sizeOption) => (
                        <SelectItem key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={size.available_qty}
                    onChange={(e) => {
                      const updatedSizes = [...variant.sizes];
                      updatedSizes[sizeIndex].available_qty = Number(
                        e.target.value,
                      );
                      updateVariant(index, { sizes: updatedSizes });
                    }}
                    placeholder="Available Quantity"
                    className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              ))}
              <Button type="button" onClick={() => addSize(index)}>
                Add Size
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addVariant}>
          Add Variant
        </Button>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {type === "create"
            ? isSubmitting
              ? "Creating..."
              : "Create Product"
            : isSubmitting
              ? "Updating..."
              : "Update Product"}
        </Button>
        {type === "update" && (
          <div className="space-y-4">
            {isPublished ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleUnPublish}
                disabled={isPublishing}
              >
                {isPublishing ? "Unpublish..." : "Unpublish"}
              </Button>
            ) : (
              <Button type="button" onClick={handlePublish}>
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
