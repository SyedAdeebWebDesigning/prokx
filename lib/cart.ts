import { toast } from "react-toastify";

// cart.ts
interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
  availableQty: number; // Added availableQty field
  image: string;
  maxQuantity: number;
}

interface Cart {
  items: CartItem[];
}

const CART_KEY = "cart";

// Get the cart from localStorage or initialize it
export const getCart = (): Cart => {
  const cart = localStorage.getItem(CART_KEY || "cart");
  return cart ? JSON.parse(cart) : { items: [] };
};

// Save the cart to localStorage
const saveCart = (cart: Cart): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Add an item to the cart
export const addCart = (item: CartItem): void => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.id === item.id,
  );

  if (existingItemIndex >= 0) {
    const existingItem = cart.items[existingItemIndex];
    const newQuantity = existingItem.quantity + item.quantity;

    if (newQuantity > item.availableQty) {
      toast.error("Cannot add more items than available quantity.");
      return;
    }

    cart.items[existingItemIndex] = { ...existingItem, quantity: newQuantity };
  } else {
    if (item.quantity > item.maxQuantity) {
      toast.error(`Cannot add more than ${item.maxQuantity} of this item.`);
      return;
    }

    cart.items.push(item);
  }

  saveCart(cart);
};

// Remove an item from the cart
export const removeCart = (itemId: string): void => {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== itemId);
  saveCart(cart);
};

// Remove one item from the cart
export const removeOneItem = (itemId: string): void => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.id === itemId,
  );

  if (existingItemIndex >= 0) {
    const existingItem = cart.items[existingItemIndex];
    const newQuantity = existingItem.quantity - 1;

    if (newQuantity <= 0) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      cart.items[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };
    }

    saveCart(cart);
  }
};

// Clear all items from the cart
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

// Update the cart items based on their available quantity
export const updateCartItemsAvailability = (updatedItems: CartItem[]): void => {
  const cart = getCart();
  cart.items = cart.items.map((item) => {
    const updatedItem = updatedItems.find((uItem) => uItem.id === item.id);
    if (updatedItem) {
      item.availableQty = updatedItem.availableQty;
    }
    return item;
  });
  saveCart(cart);
};

// Get cart items
export const getCartItems = (): CartItem[] => {
  return getCart().items;
};

// Get cart length
export const cartLength = (): number => {
  return getCart().items.length || 0;
};

export const getSubtotal = (): number => {
  return getCartItems().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};
