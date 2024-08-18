import { getUserById } from "@/lib/actions/user.action";
import { IReview } from "@/lib/database/models/Reviews.model";
import User from "@/lib/database/models/User.model";
import Image from "next/image";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface ReviewProps {
  review: IReview;
}

const Review = async ({ review }: ReviewProps) => {
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
  const userId = review.user_clerk_id;
  const user: User = await getUserById(userId);
  return (
    <div className="my-1 w-full bg-gray-100 px-5 py-2">
      <div className="flex items-center">
        <div className="relative size-8">
          <Image
            fill
            src={user.photo}
            alt="User Avatar"
            className="rounded-full"
          />
        </div>
        <div className="ml-2">
          <h3 className="text-md text-muted-foreground">{user.username}</h3>
          <div className="flex items-center">
            {renderStars(review.user_rating)}
          </div>
        </div>
      </div>
      <p className="text-md line-clamp-2">{review.user_review}</p>
    </div>
  );
};

export default Review;
