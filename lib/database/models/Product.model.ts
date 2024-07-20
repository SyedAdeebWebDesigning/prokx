import mongoose, { Schema, Document } from "mongoose";

interface ProductReview {
  user_clerk_id: string;
  user_rating: number;
  user_review: string;
}

export interface ProductVariant {
  _id: string;
  color_name: string;
  color_hex_code: string;
  images: { url: string }[];
  sizes: { size: string; available_qty: number }[];
}

export interface IProductDocument extends Document {
  product_name: string;
  product_description: string;
  product_price: number;
  product_reviews?: ProductReview[];
  product_variants: ProductVariant[];
  product_category?: string;
  isPublished: boolean;
  created_at: Date;
  updated_at: Date;
}

export const productReviewSchema = new Schema<ProductReview>({
  user_clerk_id: { type: String, required: true },
  user_rating: { type: Number, required: true },
  user_review: { type: String, required: true },
});

const productVariantSchema = new Schema<ProductVariant>({
  color_name: { type: String, required: true },
  color_hex_code: { type: String, required: true },
  images: [{ url: { type: String, required: true } }],
  sizes: [
    {
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
      available_qty: { type: Number, required: true },
    },
  ],
});

const productSchema = new Schema<IProductDocument>(
  {
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    isPublished: { type: Boolean, required: true, default: false },
    product_variants: [productVariantSchema],
    product_category: { type: String }, // Define as String type
  },
  { timestamps: true },
);
const Product =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", productSchema);

export default Product;
