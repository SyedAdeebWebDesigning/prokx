"use client";

import { createStripeCheckoutSession } from "@/lib/actions/orders.action";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { clearCart, isCartTampered } from "@/lib/cart";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckOutButtonProps {
  price: number;
  cartItems: any[];
  userAddress: any;
  userClerkId: string;
  userEmail: string;
}

const CheckOutButton = ({
  price,
  cartItems,
  userAddress,
  userClerkId,
  userEmail,
}: CheckOutButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = async () => {
    // Check if the component is mounted
    if (!isMounted) return;

    // Check if user has address
    if (!userAddress) {
      router.push("/address?type=create");
      return;
    }

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
        userClerkId,
        userEmail,
      );
      window.location.href = checkoutUrl as string;
    } catch (err: any) {
      toast.error(
        "Size exceeds the limit of 1MB. Try removing some items and try again.",
      );
    } finally {
      setIsSubmitting(false);
      // Uncomment to clear cart after checkout
      // clearCart();
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
          {isSubmitting ? "" : `Pay ${formatCurrency(price)}`}
        </p>
      ) : (
        "Complete Your Profile"
      )}
    </Button>
  );
};

export default CheckOutButton;
