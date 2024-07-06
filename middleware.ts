import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/api/webhooks/clerk",
	"/api/webhooks/stripe",
	"/api/uploadthing/",
]);

export default clerkMiddleware((auth, req) => {
	if (!isPublicRoute(req)) auth().protect();
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
