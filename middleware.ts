import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/products",
  "/products/tshirts",
  "/products/hoodies",
  "/products/sweatshirts",
  "/products/zippers",
  "/products/mugs",
  "/products/caps",
  "/orders",
  "/admin-dashboard",
  "/admin-users",
  "/admin-orders",
  "/admin-products",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
