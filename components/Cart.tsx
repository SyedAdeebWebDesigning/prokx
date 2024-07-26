"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  addCart,
  cartLength,
  clearCart,
  getCart,
  getSubtotal,
  removeCart,
  removeOneItem,
} from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";

import { Minus, Plus, ShoppingBagIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/actions/product.action"; // Import your server actions
import { ProductVariant } from "@/lib/database/models/Product.model";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { getUserAddress } from "@/lib/actions/user.action";
import CheckOutButton from "./CheckOutButton";

interface CartProps {
  userClerkId: string;
  clerkUser: string;
  userEmail: string;
}

const Cart = ({ userClerkId, clerkUser, userEmail }: CartProps) => {
  const [cart, setCart] = useState(getCart());
  const [cartItems, setCartItems] = useState(cart.items.length);
  const [userAddress, setUserAddress] = useState<any | null>(null);
  const userId = clerkUser;

  useEffect(() => {
    const fetchUserAddress = async (userClerkId: string) => {
      try {
        const address: any = await getUserAddress(userClerkId);
        if (address.success) {
          if (address) {
            setUserAddress(address.address);
          } else {
            setUserAddress(null);
          }
        }
      } catch (error) {}
    };

    fetchUserAddress(userClerkId);
  }, []);

  // Function to update cart items based on their availability
  const updateCartItemsAvailability = async () => {
    try {
      const updatedCart = getCart();
      const updatedItems = await Promise.all(
        updatedCart.items.map(async (item) => {
          const product = await getProductById(item.id);
          const variant = await product.product_variants.find(
            (v: ProductVariant) =>
              v.color_name === item.color &&
              v.sizes.some((s) => s.size === item.size),
          );
          const availableQty = variant?.sizes.find(
            (s: any) => s.size === item.size,
          )?.available_qty;

          return {
            ...item,
            availableQty,
          };
        }),
      );

      const filteredItems = updatedItems.filter(
        (item) => item.availableQty > 0,
      );

      if (filteredItems.length < updatedCart.items.length) {
        setCart({ items: filteredItems });
        setCartItems(filteredItems.length);
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Initial update of cart items availability
    updateCartItemsAvailability();
    // Update the cart state and cart items count
    setCart(getCart());
    setCartItems(cartLength());
  }, []);

  const handleAddItem = (item: any) => {
    addCart(item);
    updateCartItemsAvailability(); // Ensure availability is updated
    setCart(getCart());
    setCartItems(cartLength());
  };

  const handleRemoveOneItem = (itemId: string) => {
    removeOneItem(itemId);
    updateCartItemsAvailability(); // Ensure availability is updated
    setCart(getCart());
    setCartItems(cartLength());
  };

  const handleRemoveItem = (itemId: string) => {
    removeCart(itemId);
    window.location.reload();
  };

  const subtotal = getSubtotal();
  const shipping = 99;
  const total = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger className="outline-none">
        <div className="flex items-center space-x-1">
          <ShoppingBagIcon className="size-5" />
          <h2 className="line-clamp-1">Cart ({cartItems})</h2>
        </div>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>Cart ({cartItems})</SheetTitle>
          <SheetDescription className="relative">
            {cartItems > 0 ? (
              <section className="relative h-[75vh] overflow-y-scroll">
                {cart.items.map((item, index) => {
                  const [itemLength, setItemLength] = useState(item.quantity);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-2 border-b-2"
                    >
                      <Image
                        width={32}
                        height={32}
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex w-full items-center justify-between">
                        <div className="">
                          <h3 className="line-clamp-2">
                            {index + 1}. {item.name} ({item.size}/{item.color})
                          </h3>
                          <p className="text-gray-500">
                            {formatCurrency(
                              Number(item.price * itemLength || item.quantity),
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 px-4 py-2">
                          <button
                            className="w-full cursor-pointer rounded-full bg-primary/[0.1] p-1 disabled:cursor-not-allowed disabled:opacity-35"
                            onClick={() => {
                              if (itemLength > 1) {
                                setItemLength(itemLength - 1);
                                handleRemoveOneItem(item.id);
                              } else {
                                handleRemoveItem(item.id);
                              }
                            }}
                          >
                            <Minus className="size-4" />
                          </button>
                          <p>{itemLength}</p>
                          <button
                            className="cursor-pointer rounded-full bg-primary/[0.1] p-1"
                            onClick={() => {
                              if (itemLength < item.availableQty) {
                                setItemLength(itemLength + 1);
                                handleAddItem({ ...item, quantity: 1 });
                              } else {
                                toast.error(
                                  "Cannot add more items than available quantity.",
                                );
                              }
                            }}
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            ) : (
              <p>Your cart is empty</p>
            )}
            {cartItems > 0 && (
              <div className="absolute bottom-0 h-10 w-full bg-gradient-to-b from-transparent to-white" />
            )}
          </SheetDescription>
          {cartItems > 0 && (
            <div className="absolute bottom-1 left-0 flex w-full flex-col px-2">
              <div className="mt-5 flex items-center justify-between text-muted-foreground">
                <p>Subtotal</p>
                <p>{formatCurrency(Number(subtotal))}</p>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>{formatCurrency(Number(shipping))}</p>
              </div>
              <div className="my-2 flex items-center justify-between border-t text-lg">
                <p>Total</p>
                <p>{formatCurrency(Number(total))}</p>
              </div>
              <CheckOutButton
                price={total}
                cartItems={cart.items}
                userAddress={userAddress}
                userClerkId={userId}
                userEmail={userEmail}
              />
              <Button
                variant={"destructive"}
                className="mt-1"
                onClick={() => {
                  clearCart();
                  toast.success("Cart has been cleared", {
                    autoClose: false,
                  });
                  window.location.reload();
                }}
              >
                <Trash2 className="mr-1 size-5" />
                Clear Cart
              </Button>
            </div>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
