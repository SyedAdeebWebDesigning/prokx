"use client";

import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteReview } from "@/lib/actions/review.actions";
import { toast } from "react-toastify";
import { useState } from "react";

interface DeleteReviewProps {
  userId: string;
  reviewId: string;
}

const DeleteReview = ({ userId, reviewId }: DeleteReviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(userId);
  const handleDeleteReview = async () => {
    try {
      setIsLoading(true);
      await deleteReview(id, reviewId);
    } catch (error: any) {
    } finally {
      toast.success("Review deleted successfully", { autoClose: false });
      setIsLoading(false);
      window.location.reload();
    }
  };

  console.log(id);
  console.log(reviewId);

  return (
    <Button
      variant={"ghost"}
      disabled={isLoading}
      onClick={handleDeleteReview}
      className="size-10 rounded-full bg-red-300 p-2 hover:bg-red-400"
    >
      <Trash2 />
    </Button>
  );
};

export default DeleteReview;
