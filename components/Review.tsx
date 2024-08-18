import { getUserById } from "@/lib/actions/user.action";
import { IReview } from "@/lib/database/models/Reviews.model";
import Image from "next/image";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import DeleteReview from "./DeleteReview";
import { currentUser } from "@clerk/nextjs/server";

interface ReviewProps {
  review: IReview;
}

const Review = async ({ review }: ReviewProps) => {
  // Fetch the current user's information server-side
  const clerkUser = await currentUser();

  if (!clerkUser) {
    // Handle the case where the current user is not logged in
    return <p>User not logged in.</p>;
  }

  const userId = review.user_clerk_id;

  // Fetch the review author's information
  const user = await getUserById(userId);

  if (!user) {
    // Handle the case where the user data couldn't be retrieved
    return <p>User data not found.</p>;
  }

  // Determine if the current user is the same as the review author
  const isSameUser = userId === clerkUser.id;

  // Render the stars based on the rating
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
    <div className="relative my-1 w-full bg-gray-100 px-5 py-2">
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
      <p className="text-md mt-2 line-clamp-2">{review.user_review}</p>

      {isSameUser && (
        <div className="absolute right-2 top-2">
          <DeleteReview
            userId={JSON.stringify(clerkUser.id ?? "")}
            reviewId={JSON.parse(JSON.stringify(review._id))}
          />
        </div>
      )}
    </div>
  );
};

export default Review;
