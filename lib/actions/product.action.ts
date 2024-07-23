"use server";

import { connectToDatabase } from "../database";
import Product, { IProductDocument } from "../database/models/Product.model";

export interface CreateProductData {
  product_name: string;
  product_description: string;
  product_price: number;
  product_category: string; // Adjust type if product_category is no longer embedded
  product_variants: {
    color_name: string;
    color_hex_code: string;
    images: { url: string }[];
    sizes: { size: string; available_qty: number }[];
  }[];
  isPublished?: boolean; // Optional, depending on your requirements
}
// Create a new product
export const createProduct = async (productData: CreateProductData) => {
  try {
    await connectToDatabase();

    const newProduct = await Product.create(productData);
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {}
};

// Get a product by ID
export const getProductById = async (productId: string) => {
  try {
    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {}
};

// Get all products
export const getAllProducts = async () => {
  try {
    await connectToDatabase();

    const products = await Product.find();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {}
};

// Update a product
export const updateProduct = async (
  productId: string,
  updateData: Partial<IProductDocument>,
) => {
  try {
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updates against the schema
      },
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {}
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  try {
    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new Error("Product not found");
    }

    return JSON.parse(JSON.stringify(deletedProduct));
  } catch (error) {}
};

// Get all publishable products
export const getPublishableProducts = async () => {
  try {
    await connectToDatabase();

    const products = await Product.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {}
};

export const publishProduct = async (productId: string) => {
  try {
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isPublished: true },
      { new: true },
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct.toJSON(); // Convert to JSON-serializable object
  } catch (error) {}
};

// Action for un-publishing a product
export const unpublishProduct = async (productId: string) => {
  try {
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isPublished: false },
      { new: true },
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct.toJSON(); // Convert to JSON-serializable object
  } catch (error) {}
};

export const getProductsByCategory = async (category: string) => {
  try {
    await connectToDatabase();
    const products = await Product.find({
      product_category: category,
      isPublished: true,
    }).sort({
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {}
};
