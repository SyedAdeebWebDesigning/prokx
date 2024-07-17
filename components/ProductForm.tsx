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

interface Size {
  size: string; // Updated to string type for Select component
  available_qty: number;
}

interface Image {
  url: string; // URL of the image
  file?: File; // Optional file object for new uploads
}

interface Variant {
  color_name: string;
  color_hex_code: string;
  images: Image[]; // Array of Image objects containing URL and optional file
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
  const [isPublished, setIsPublished] = useState<boolean>(false); // State for publish status
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        setIsPublished(product.isPublished || false); // Initialize publish status
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
        isPublished: false,
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
        // Implement update logic if needed
        await updateProduct(String(product._id), data);
        toast.success("Product updated successfully");
        setTimeout(() => {
          router.push("/admin-products");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error saving product:", error);
    }
  };

  const handlePublish = async () => {
    if (!product) return; // Ensure product is defined

    try {
      await publishProduct(String(product._id)); // Convert product._id to string before passing it as an argument
      setIsPublished(true);
      toast.success("Product published successfully");
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error publishing product:", error);
    } finally {
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  };

  const handleUnPublish = async () => {
    if (!product) return; // Ensure product is defined

    try {
      await unpublishProduct(String(product._id)); // Convert product._id to string before passing it as an argument
      setIsPublished(false);
      toast.success("Product unpublished successfully");
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error un-publishing product:", error);
    } finally {
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

  if (isLoading) {
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
          className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Description
        </Label>
        <Input
          type="text"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Product Description"
          className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Price
        </Label>
        <Input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Product Price"
          className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          Product Category
        </Label>
        <Select
          onValueChange={(value) => setProductCategory(value)}
          value={productCategory}
        >
          <SelectTrigger className="w-full rounded">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded">
            {ProductCategories.map((value: string, index: number) => (
              <SelectItem key={index} className="rounded" value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Variants</h3>
          <Button
            type="button"
            onClick={addVariant}
            className="my-2 rounded px-4 py-2 text-white shadow-sm hover:bg-blue-600"
          >
            Add Variant
          </Button>
        </div>
        {variants.map((variant, index) => (
          <div key={index} className="space-y-4 rounded border p-4 shadow-sm">
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
                className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex w-full flex-col items-center justify-center space-x-4">
                <Label className="block text-sm font-medium text-gray-700">
                  Color Picker
                </Label>
                <SketchPicker
                  color={variant.color_hex_code}
                  onChange={(color) => handleColorChange(color, index)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Sizes
              </Label>
              {variant.sizes.map((size, sizeIndex) => (
                <div key={sizeIndex} className="flex space-x-4">
                  <Select
                    value={size.size}
                    onValueChange={(value) => {
                      const updatedSizes = [...variant.sizes];
                      updatedSizes[sizeIndex].size = value;
                      updateVariant(index, { sizes: updatedSizes });
                    }}
                  >
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      {SizeOptions.map((option, optIndex) => (
                        <SelectItem
                          key={optIndex}
                          className="rounded"
                          value={option}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={size.available_qty}
                    onChange={(e) => {
                      const updatedSizes = [...variant.sizes];
                      updatedSizes[sizeIndex].available_qty = parseInt(
                        e.target.value,
                      );
                      updateVariant(index, { sizes: updatedSizes });
                    }}
                    placeholder="Available Quantity"
                    className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addSize(index)}
                className="mt-2 rounded px-4 py-2 text-white shadow-sm hover:bg-blue-600"
              >
                Add Size
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Images
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, index)}
                  className="block rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {variant.images.map((image, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={image.url}
                    alt={`Variant ${index + 1} Image ${imageIndex + 1} ${image.url}`}
                    className="h-20 rounded border border-gray-300 object-contain shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
          disabled={type === "create" && !isFormValid}
        >
          {type === "create" ? "Create Product" : "Update Product"}
        </Button>
        {type === "update" && (
          <Button
            type="button"
            variant={"outline"}
            onClick={product?.isPublished ? handleUnPublish : handlePublish}
            className="ml-2 rounded px-4 py-2 shadow-sm"
          >
            {product?.isPublished ? "Un-Publish" : "Publish"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
