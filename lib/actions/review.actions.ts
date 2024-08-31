"use server";

import { connectToDatabase } from "../database";
import Reviews from "../database/models/Reviews.model";

/**
 * Adds a new review to the database.
 *
 * @param {any} reviewData - The data of the review to be added.
 * @returns {Promise<any>} - A promise that resolves with the added review data.
 * @throws {Error} - If creating the review fails.
 */
export const addReview = async (reviewData: any): Promise<any> => {
  try {
    await connectToDatabase();
    const data = await Reviews.create(reviewData);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(`Error creating review: ${error.message}`);
  }
};

/**
 * Retrieves all reviews for a specific product by its ID.
 *
 * @param {string} productId - The ID of the product.
 * @returns {Promise<any>} - A promise that resolves with the reviews data.
 * @throws {Error} - If fetching the reviews fails.
 */
export const getReviewsByProductId = async (
  productId: string,
): Promise<any> => {
  try {
    await connectToDatabase();
    const data = await Reviews.find({ productId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(`Error fetching reviews by product ID: ${error.message}`);
  }
};

/**
 * Retrieves all reviews made by a specific user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - A promise that resolves with the reviews data.
 * @throws {Error} - If fetching the reviews fails.
 */
export const getReviewsByUserId = async (userId: string): Promise<any> => {
  try {
    await connectToDatabase();
    const data = await Reviews.find({ user_clerk_id: userId });
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(`Error fetching reviews by user ID: ${error.message}`);
  }
};

/**
 * Edits an existing review.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} reviewId - The ID of the review to be edited.
 * @param {any} reviewData - The updated review data.
 * @returns {Promise<any>} - A promise that resolves with the updated review.
 * @throws {Error} - If updating the review fails.
 */
export const editReview = async (
  userId: string,
  reviewId: string,
  reviewData: any,
): Promise<any> => {
  try {
    return Reviews.findOneAndUpdate(
      { user_clerk_id: userId, _id: reviewId },
      reviewData,
      { new: true },
    );
  } catch (error: any) {
    throw new Error(`Error updating review: ${error.message}`);
  }
};

/**
 * Deletes a review.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} reviewId - The ID of the review to be deleted.
 * @returns {Promise<any>} - A promise that resolves when the review is deleted.
 * @throws {Error} - If deleting the review fails.
 */
export const deleteReview = async (
  userId: string,
  reviewId: string,
): Promise<any> => {
  try {
    return Reviews.findOneAndDelete({ user_clerk_id: userId, _id: reviewId });
  } catch (error: any) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};

/**
 * Retrieves the total number of reviews for a specific product.
 *
 * @param {string} productId - The ID of the product.
 * @returns {Promise<number>} - A promise that resolves with the total number of reviews.
 * @throws {Error} - If fetching the review count fails.
 */
export const getProductReviewLength = async (
  productId: string,
): Promise<number> => {
  try {
    return Reviews.find({ productId }).countDocuments();
  } catch (error: any) {
    throw new Error(`Error fetching review count: ${error.message}`);
  }
};
