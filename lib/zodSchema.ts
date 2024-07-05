import { z } from "zod";

export const formSchema = z.object({
	street: z.string().min(1, {
		message: "Street is required.",
	}),
	city: z.string().min(1, {
		message: "City is required.",
	}),
	state: z.string().min(1, {
		message: "State is required.",
	}),
	country: z.string().min(1, {
		message: "Country is required.",
	}),
	postalCode: z.string().min(1, {
		message: "Postal code is required.",
	}),
});
