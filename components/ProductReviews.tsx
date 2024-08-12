import { StarIcon } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ReviewForm from "./ReviewForm";

interface ProductReviewsProps {
  productId: string;
  userId: string
}

const ProductReviews = ({ productId, userId }: ProductReviewsProps) => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col justify-between sm:flex-row">
        <div>
          <h2 className="text-4xl">Product Reviews</h2>
        </div>
        <div className="my-5 flex flex-col items-center space-x-2 sm:flex-row">
          <div>
            <h2 className="text-5xl">4.1</h2>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <StarIcon fill="#ffd700" />
              <StarIcon fill="#ffd700" />
              <StarIcon fill="#ffd700" />
              <StarIcon fill="#ffd700" />
              <StarIcon />
            </div>
            <p className="text-center text-muted-foreground sm:text-left">
              231 Reviews
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col items-center">
            <h2 className="text-2xl font-bold">Add a review</h2>
            <ReviewForm userId={userId} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <p className="text-gray-500">No reviews yet</p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductReviews;
