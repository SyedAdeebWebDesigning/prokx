"use client";

import { createStripeCheckoutSession } from "@/lib/actions/orders.action";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { clearCart, isCartTampered } from "@/lib/cart";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckOutButtonProps {
  price: number;
  cartItems: any[];
  userAddress: any;
  userFullName: string;
  userEmail: string;
}

const CheckOutButton = ({
  price,
  cartItems,
  userAddress,
  userFullName,
  userEmail,
}: CheckOutButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    // Check if user has address
    if (!userAddress) {
      // Redirect to profile page
      window.location.href = "/address?type=create";
      return;
    }
;

    // Check if the cart has been tampered with
    if (isCartTampered()) {
      toast.error("Cart has been tampered with.", { autoClose: false });
      clearCart();
      window.location.reload();
      return;
    }

    // Proceed to checkout
    try {
      setIsSubmitting(true);
      const checkoutUrl = await createStripeCheckoutSession(
        cartItems,
        userAddress,
        userFullName,
        userEmail,
      );
      window.location.href = checkoutUrl as string;
    } catch (err: any) {
      toast.error(
        "Size exceeds the limit of 1MB. Try removing some items and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isSubmitting}>
      {userAddress ? (
        <p className="flex items-center">
          {isSubmitting && (
            <span className="mr-2 animate-spin">
              <Loader2 />
            </span>
          )}{" "}
          {isSubmitting ? "Submitting..." : `Pay ${formatCurrency(price)}`}
        </p>
      ) : (
        "Complete Your Profile"
      )}
    </Button>
  );
};

export default CheckOutButton;
