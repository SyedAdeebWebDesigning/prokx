import { toast } from "react-toastify";

// cart.ts
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
  availableQty: number;
  image: string; // Added image field
  maxQuantity: number; // Added maxQuantity field
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

    // Check if adding the item exceeds available quantity
    if (newQuantity > item.availableQty) {
      toast.error("Cannot add more items than available quantity.");
    }

    // Update the existing item's quantity
    cart.items[existingItemIndex] = { ...existingItem, quantity: newQuantity };
  } else {
    // Ensure the item’s quantity does not exceed maxQuantity
    if (item.quantity > item.maxQuantity) {
      throw new Error(`Cannot add more than ${item.maxQuantity} of this item.`);
    }

    // Add the new item to the cart
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

// Clear all items from the cart
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

// Example usage of getCart
export const getCartItems = (): CartItem[] => {
  return getCart().items;
};

export const cartLength = () => {
  return getCart().items.length || 0;
};
