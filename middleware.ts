import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
	"/",
	"/products",
	"/tshirts",
	"/hoodies",
	"/sweatshirts",
	"/zippers",
	"/mugs",
	"/caps",
	"/orders",
	"/dashboard",
]);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect();
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
