import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ReviewForm from "./ReviewForm";
import {
  getProductReviewLength,
  getReviewsByProductId,
} from "@/lib/actions/review.actions";
import Review from "./Review";
import { IReview } from "@/lib/database/models/Reviews.model";

interface ProductReviewsProps {
  productId: string;
  userId: string;
}

const ProductReviews = async ({ productId, userId }: ProductReviewsProps) => {
  const data = await getReviewsByProductId(productId);
  const reviews = JSON.parse(JSON.stringify(data));

  // Calculate the average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) => sum + review.user_rating,
          0,
        ) / reviews.length
      : 0;

  const reviewLength = getProductReviewLength(productId);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col justify-between sm:flex-row">
        <div>
          <h2 className="text-4xl">Product Reviews</h2>
        </div>
        <div className="my-5 flex flex-col items-center space-x-2 sm:flex-row">
          <div>
            <h2 className="text-5xl">{averageRating.toFixed(1)}</h2>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              {renderStars(averageRating)}
            </div>
            <p className="text-center text-muted-foreground sm:text-left">
              {reviewLength} Reviews
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col items-center">
            <h2 className="text-2xl font-bold">Add a review</h2>
            <ReviewForm userId={userId} productId={productId} />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex h-[30vh] w-full flex-col items-center overflow-scroll">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review: IReview) => <Review review={review} />)
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductReviews;
