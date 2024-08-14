"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { addReview } from "@/lib/actions/review.actions";

interface ReviewFormProps {
  userId: string;
  productId: string;
}

const formSchema = z.object({
  userRating: z.number().int().min(1).max(5).default(1),
  userReview: z.string().min(3, {
    message: "Review must be at least 3 characters long",
  }),
});

const ReviewForm = ({ userId, productId }: ReviewFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userRating: 1,
      userReview: "",
    },
  });

  const [rating, setRating] = useState<number>(form.getValues("userRating"));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const reviewData = {
        productId: productId,
        user_clerk_id: userId,
        user_rating: values.userRating,
        user_review: values.userReview,
      };

      console.log(reviewData);

      await addReview(reviewData);

      toast.success("Review submitted successfully");
      setTimeout(() => {
        form.reset();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRatingChange = (value: number) => {
    setRating(value);
    form.setValue("userRating", value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded bg-white p-4"
      >
        <FormField
          control={form.control}
          name="userRating"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg font-semibold">
                Your Rating
              </FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-6 w-6 cursor-pointer ${
                        value <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRatingChange(value)}
                      fill={value <= rating ? "currentColor" : "none"} // Conditionally fill the star
                    />
                  ))}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userReview"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg font-semibold">
                Your Review
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your review here..."
                  className="w-full resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
