import { toast } from "react-toastify";
import { createHash } from "crypto";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
  availableQty: number;
  image: string;
  maxQuantity: number;
}

interface Cart {
  items: CartItem[];
}

const CART_KEY = "cart";
const CART_HASH_KEY = process.env.SECRET_KEY!;

// Get the cart from localStorage or initialize it
export const getCart = (): Cart => {
  const cart = localStorage.getItem(CART_KEY || "cart");
  return cart ? JSON.parse(cart) : { items: [] };
};

// Save the cart to localStorage and update the hash
const saveCart = (cart: Cart): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartHash(cart);
};

// Generate a hash for the cart data
const generateCartHash = (cart: Cart): string => {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(cart.items));
  return hash.digest("hex");
};

// Update the cart hash in localStorage
const updateCartHash = (cart: Cart): void => {
  const hash = generateCartHash(cart);
  localStorage.setItem(CART_HASH_KEY, hash);
};

// Validate the current cart hash against the saved hash
export const isCartTampered = (): boolean => {
  const savedHash = localStorage.getItem(CART_HASH_KEY);
  const currentCart = getCart();
  const currentHash = generateCartHash(currentCart);
  return savedHash !== currentHash;
};

// Other cart functions (addCart, removeCart, etc.) remain the same

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

export const removeCart = (itemId: string): void => {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== itemId);
  saveCart(cart);
};

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

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_HASH_KEY);
};

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

export const getCartItems = (): CartItem[] => {
  return getCart().items;
};

export const cartLength = (): number => {
  return getCart().items.length || 0;
};

export const getSubtotal = (): number => {
  return getCartItems().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};
