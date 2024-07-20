"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addCart, cartLength, getCart } from "@/lib/cart";

import { Minus, Plus, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CartProps {}

const Cart = ({}: CartProps) => {
  const cart = getCart();
  const cartLen = cartLength();
  const cartItems = cartLen;
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
          <SheetDescription>
            {cartItems > 0 ? (
              <section>
                {cart.items.map((item) => {
                  const [itemLength, setItemLength] = useState(item.quantity);
                  return (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Image
                        width={64}
                        height={64}
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex w-full items-center justify-between">
                        <div className="">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="text-gray-500">
                            ₹{item.price * itemLength || item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2">
                          <div className="w-full rounded-full bg-primary/[0.1] p-1">
                            <Minus className="size-4" />
                          </div>
                          <p>{itemLength || item.quantity}</p>
                          <div
                            className="cursor-pointer rounded-full bg-primary/[0.1] p-1"
                            onClick={() => {
                              setItemLength(itemLength + 1);
                              addCart({ ...item });
                            }}
                          >
                            <Plus className="size-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            ) : (
              <p>Your cart is empty</p>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
