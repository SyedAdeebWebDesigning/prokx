"use client";

import { useState } from "react";
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

interface Size {
  size: string;
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

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState<number | string>("");
  const [productCategory, setProductCategory] = useState<string>("T Shirts");
  const [variants, setVariants] = useState<Variant[]>([]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color_name: "",
        color_hex_code: "",
        images: [], // Initialize with an empty array
        sizes: [{ size: "", available_qty: 0 }],
      },
    ]);
  };

  const updateVariant = (index: number, updatedVariant: Partial<Variant>) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], ...updatedVariant };
    setVariants(updatedVariants);
  };

  const addSize = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({ size: "", available_qty: 0 });
    setVariants(updatedVariants);
  };

  const handleImageUpload = (variantIndex: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const updatedVariants = [...variants];
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      updatedVariants[variantIndex].images = [
        ...updatedVariants[variantIndex].images.filter((img) => img.file),
        { url: imageUrl, file },
      ];
      setVariants(updatedVariants);
    }
  };

  const handleColorChange = (color: ColorResult, index: number) => {
    const updatedVariants = [...variants];
    updatedVariants[index].color_hex_code = color.hex;
    setVariants(updatedVariants);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      productName,
      productDescription,
      productPrice: Number(productPrice),
      productCategory,
      variants,
    });
  };

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
            <SelectItem className="rounded" value="T Shirts">
              T Shirts
            </SelectItem>
            <SelectItem className="rounded" value="Hoodies">
              Hoodies
            </SelectItem>
            <SelectItem className="rounded" value="Sweatshirts">
              Sweatshirts
            </SelectItem>
            <SelectItem className="rounded" value="Zippers">
              Zippers
            </SelectItem>
            <SelectItem className="rounded" value="Caps">
              Caps
            </SelectItem>
            <SelectItem className="rounded" value="Mugs">
              Mugs
            </SelectItem>
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
            <div className="flex w-full flex-col items-center justify-center">
              <Label className="block text-sm font-medium text-gray-700">
                Color Hex Code
              </Label>
              <SketchPicker
                color={variant.color_hex_code}
                onChange={(color: ColorResult) =>
                  handleColorChange(color, index)
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Images
              </Label>
              {variant.images.map((image, imageIndex) => (
                <div key={imageIndex} className="space-y-2">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor={`picture-${index}-${imageIndex}`}>
                      Picture
                    </Label>
                    <Input
                      id={`picture-${index}-${imageIndex}`}
                      type="file"
                      className="cursor-pointer rounded"
                      onChange={(e) => handleImageUpload(index, e.target.files)}
                    />
                    {image.url && (
                      <picture>
                        <img
                          src={image.url}
                          alt={`Variant ${index} Image ${imageIndex}`}
                          className="mt-2 h-20 w-20 object-cover"
                        />
                      </picture>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  updateVariant(index, {
                    images: [...variant.images, { url: "", file: undefined }],
                  })
                }
                className="my-2 rounded px-4 py-2 text-white shadow-sm hover:bg-blue-600"
              >
                Add Image
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Sizes & Quantities
              </Label>
              {variant.sizes.map((size, sizeIndex) => (
                <div key={sizeIndex} className="flex items-center space-x-4">
                  <Input
                    type="text"
                    value={size.size}
                    onChange={(e) =>
                      updateVariant(index, {
                        sizes: [
                          ...variant.sizes.slice(0, sizeIndex),
                          { ...size, size: e.target.value },
                          ...variant.sizes.slice(sizeIndex + 1),
                        ],
                      })
                    }
                    placeholder="Size"
                    className="block w-1/2 rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <Input
                    type="number"
                    value={size.available_qty}
                    onChange={(e) =>
                      updateVariant(index, {
                        sizes: [
                          ...variant.sizes.slice(0, sizeIndex),
                          {
                            ...size,
                            available_qty: Number(e.target.value),
                          },
                          ...variant.sizes.slice(sizeIndex + 1),
                        ],
                      })
                    }
                    placeholder="Quantity"
                    className="block w-1/2 rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addSize(index)}
                className="my-2 rounded px-4 py-2 text-white shadow-sm hover:bg-blue-600"
              >
                Add Size
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="submit" className="rounded px-6 py-3 text-white shadow-sm">
        Save Product
      </Button>
    </form>
  );
};

export default ProductForm;
