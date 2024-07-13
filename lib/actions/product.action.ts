"use server";
import { connectToDatabase } from "../database";
import Product from "../database/models/Product.model";
import { IProductDocument } from "../database/models/Product.model";

// Create a new product
export const createProduct = async (productData: Partial<IProductDocument>) => {
  try {
    await connectToDatabase();

    const newProduct = await Product.create(productData);
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
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
  } catch (error) {
    console.error("Error getting product by ID:", error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    await connectToDatabase();

    const products = await Product.find();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
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
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
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
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get all publishable products
export const getPublishableProducts = async () => {
  try {
    await connectToDatabase();

    const products = await Product.find({ isPublished: true });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error getting publishable products:", error);
    throw error;
  }
};
