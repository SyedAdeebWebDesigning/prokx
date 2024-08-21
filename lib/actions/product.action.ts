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

/**
 * Creates a new product in the database.
 *
 * @param {CreateProductData} productData - The product data to create.
 * @returns {Promise<IProductDocument>} The newly created product.
 * @throws Will throw an error if the product creation fails.
 */
export const createProduct = async (
  productData: CreateProductData,
): Promise<IProductDocument> => {
  try {
    await connectToDatabase();
    const newProduct = await Product.create(productData);
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error: any) {
    throw new Error("Error creating: ", error.message);
  }
};

/**
 * Retrieves a product by its ID.
 *
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<IProductDocument | null>} The product if found, otherwise null.
 * @throws Will throw an error if the product is not found or retrieval fails.
 */
export const getProductById = async (
  productId: string,
): Promise<IProductDocument | any> => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {}
};

/**
 * Retrieves all products in the database.
 *
 * @returns {Promise<IProductDocument[]>} An array of all products.
 * @throws Will throw an error if the retrieval fails.
 */
export const getAllProducts = async (): Promise<IProductDocument[] | any> => {
  try {
    await connectToDatabase();
    const products = await Product.find();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {}
};

/**
 * Updates a product by its ID with the provided data.
 *
 * @param {string} productId - The ID of the product to update.
 * @param {Partial<IProductDocument>} updateData - The data to update the product with.
 * @returns {Promise<IProductDocument | null>} The updated product if found, otherwise null.
 * @throws Will throw an error if the product is not found or update fails.
 */
export const updateProduct = async (
  productId: string,
  updateData: Partial<IProductDocument>,
): Promise<IProductDocument | any> => {
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

/**
 * Deletes a product by its ID.
 *
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<IProductDocument | null>} The deleted product if found, otherwise null.
 * @throws Will throw an error if the product is not found or deletion fails.
 */
export const deleteProduct = async (
  productId: string,
): Promise<IProductDocument | any> => {
  try {
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return JSON.parse(JSON.stringify(deletedProduct));
  } catch (error) {}
};

/**
 * Retrieves all publishable products with pagination support.
 *
 * @param {number} [page=1] - The page number to retrieve.
 * @param {number} [limit=8] - The number of products per page.
 * @returns {Promise<IProductDocument[]>} An array of publishable products.
 * @throws Will throw an error if retrieval fails.
 */
export const getPublishableProducts = async (
  page: number = 1,
  limit: number = 8,
): Promise<IProductDocument[]> => {
  try {
    await connectToDatabase();
    const products = await Product.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Publishes a product by its ID.
 *
 * @param {string} productId - The ID of the product to publish.
 * @returns {Promise<IProductDocument | null>} The published product if found, otherwise null.
 * @throws Will throw an error if the product is not found or publishing fails.
 */
export const publishProduct = async (
  productId: string,
): Promise<IProductDocument | any> => {
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

/**
 * Unpublishes a product by its ID.
 *
 * @param {string} productId - The ID of the product to unpublish.
 * @returns {Promise<IProductDocument | null>} The unpublished product if found, otherwise null.
 * @throws Will throw an error if the product is not found or unpublishing fails.
 */
export const unpublishProduct = async (
  productId: string,
): Promise<IProductDocument | any> => {
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

/**
 * Retrieves products by category.
 *
 * @param {string} category - The category of products to retrieve.
 * @returns {Promise<IProductDocument[]>} An array of products in the specified category.
 * @throws Will throw an error if retrieval fails.
 */
export const getProductsByCategory = async (
  category: string,
): Promise<IProductDocument[] | any> => {
  try {
    await connectToDatabase();
    const products = await Product.find({
      product_category: category,
      isPublished: true,
    }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {}
};

/**
 * Decreases the available quantity of a product variant by a specified amount.
 *
 * @param {string} productId - The ID of the product.
 * @param {string} size - The size of the variant to decrease quantity for.
 * @param {string} color - The color of the variant to decrease quantity for.
 * @param {number} quantity - The amount to decrease the quantity by.
 * @returns {Promise<void>}
 * @throws Will throw an error if the product, variant, size, or quantity is invalid.
 */
export const decreaseProductQuantity = async (
  productId: string,
  size: string,
  color: string,
  quantity: number,
): Promise<void> => {
  try {
    const product: IProductDocument | null = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const variant = product.product_variants.find((variant) => {
      return (
        variant.color_name === color &&
        variant.sizes.some((s) => s.size === size)
      );
    });
    if (!variant) {
      throw new Error("Variant not found");
    }
    const sizeObj = variant.sizes.find((s) => s.size === size);
    if (!sizeObj) {
      throw new Error("Size not found");
    }
    if (sizeObj.available_qty < quantity) {
      throw new Error("Not enough quantity available");
    }
    sizeObj.available_qty -= quantity;
    await product.save();
  } catch (error: any) {
    throw new Error(`Failed to decrease quantity: ${error.message}`);
  }
};

/**
 * Retrieves related products by category, excluding a specific product ID.
 *
 * @param {string} category - The category of related products.
 * @param {string} productId - The ID of the product to exclude from the results.
 * @returns {Promise<IProductDocument[]>} An array of related products.
 * @throws Will throw an error if retrieval fails.
 */
export const getRelatedProducts = async (
  category: string,
  productId: string,
): Promise<IProductDocument[]> => {
  try {
    await connectToDatabase();
    const relatedProducts = await Product.find({
      product_category: category,
      _id: { $ne: productId },
    })
      .limit(4)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(relatedProducts));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};
