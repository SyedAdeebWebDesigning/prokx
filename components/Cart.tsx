import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingBagIcon } from "lucide-react";

interface CartProps {}

const Cart = ({}: CartProps) => {
  const cartItems = 0;
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
            {cartItems > 0 ? <div></div> : <p>Your cart is empty</p>}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
