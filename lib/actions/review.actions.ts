"use server";

import { connectToDatabase } from "../database";
import Reviews from "../database/models/Reviews.model";

export const addReview = async (reviewData: any) => {
  try {
    await connectToDatabase();
    const data = await Reviews.create(reviewData);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error("Error creating: ", error);
  }
};

export const getReviewsByProductId = async (productId: string) => {
  try {
    await connectToDatabase();
    const data = await Reviews.find({ productId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error("Error fetching: ", error);
  }
};

export const getReviewsByUserId = async (userId: string) => {
  try {
    await connectToDatabase();
    const data = await Reviews.find({ user_clerk_id: userId });
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error("Error fetching: ", error);
  }
};

export const editReview = (
  userId: string,
  reviewId: string,
  reviewData: any,
) => {
  try {
    return Reviews.findOneAndUpdate(
      { user_clerk_id: userId, _id: reviewId },
      reviewData,
      {
        new: true,
      },
    );
  } catch (error: any) {
    throw new Error("Error updating: ", error);
  }
};

export const deleteReview = (userId: string, reviewId: string) => {
  try {
    return Reviews.findOneAndDelete({ user_clerk_id: userId, _id: reviewId });
  } catch (error: any) {
    throw new Error("Error deleting: ", error);
  }
};

export const getProductReviewLength = (productId: string) => {
  try {
    return Reviews.find({ productId: productId }).countDocuments();
  } catch (error: any) {
    throw new Error("Error fetching: ", error);
  }
};
