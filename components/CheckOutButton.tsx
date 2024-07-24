"use client";

import { createStripeCheckoutSession } from "@/lib/actions/orders.action";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearCart, isCartTampered } from "@/lib/cart";

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
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready.",
      );
    }
  }, []);

  const handleCheckout = async () => {
    // Check if user has address
    if (!userAddress) {
      // Redirect to profile page
      window.location.href = "/address?type=create";
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
    }
  };

  return (
    <Button onClick={handleCheckout}>
      {userAddress ? (
        <p>Pay {formatCurrency(price)}</p>
      ) : (
        "Complete Your Profile"
      )}
    </Button>
  );
};

export default CheckOutButton;
