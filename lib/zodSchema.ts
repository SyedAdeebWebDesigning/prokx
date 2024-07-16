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

export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().min(1, "Product description is required"),
  product_price: z.number().min(0, "Product price must be a positive number"),
  product_variants: z.array(
    z.object({
      color_name: z.string().min(1, "Color name is required"),
      color_hex_code: z.string().min(1, "Color hex code is required"),
      images: z.array(z.object({ url: z.string().url("Invalid URL") })),
      sizes: z.array(
        z.object({
          size: z.enum(["S", "M", "L", "XL", "XXL"]),
          available_qty: z
            .number()
            .min(0, "Quantity must be a positive number"),
        }),
      ),
    }),
  ),
  isPublished: z.boolean().optional(),
});
