import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IReview {
  _id: string;
  productId: string;
  user_clerk_id: string;
  user_rating: number;
  user_review: string;
  createdAt: Date;
  updatedAt: Date;
}

export const reviewSchema = new Schema(
  {
    productId: { type: String, required: true },
    user_clerk_id: { type: String, required: true },
    user_rating: { type: Number, required: true },
    user_review: { type: String, required: true },
  },
  { timestamps: true },
);

const Reviews =
  mongoose.models.Reviews || mongoose.model("Reviews", reviewSchema);

export default Reviews;
