"use client";
import { formSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import User from "@/lib/database/models/User.model";
import {
	addAddressToUser,
	updateAddressOfUser,
} from "@/lib/actions/user.action";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AddressFormProps {
	searchParams: {
		type: "create" | "update";
	};
	user: User;
}

const AddressForm = ({ searchParams, user }: AddressFormProps) => {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			street: user?.address?.street || "",
			city: user?.address?.city || "",
			state: user?.address?.state || "",
			country: user?.address?.country || "",
			postalCode: user?.address?.postalCode || "",
		},
	});

	if (user.hasProfileCompleted) {
		router.push("/profile?type=update");
	} else {
		router.push("/profile?type=create");
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (searchParams.type === "create") {
				try {
					const { street, city, state, country, postalCode } = values;

					const address = {
						street,
						city,
						state,
						country,
						postalCode,
					};

					await addAddressToUser({ clerkId: user.clerkId, address });
					toast.success("Address added successfully");
					setTimeout(() => {
						window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}`;
					}, 1500);
				} catch (error) {
					toast.error("Error creating address");
				}
			} else if (searchParams.type === "update") {
				try {
					const { street, city, state, country, postalCode } = values;

					const address = {
						street,
						city,
						state,
						country,
						postalCode,
					};

					await updateAddressOfUser({ clerkId: user.clerkId, address });
					toast.success("Address updated successfully");
					setTimeout(() => {
						window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}`;
					}, 1500);
				} catch (error) {
					toast.error("Error updating address");
				}
			}
		} catch (error) {
			toast.error("Error");
		}
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center flex-col min-h-[80vh] w-1/6 mx-auto">
				<h3 className="text-3xl">User not found</h3>
				<Link
					href={"/sign-in"}
					className={cn("my-4 w-full", buttonVariants({ variant: "default" }))}>
					Sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md">
				<h1 className="text-2xl font-semibold text-center mb-8">
					{searchParams.type === "create" ? "Create Address" : "Update Address"}{" "}
				</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 px-3">
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="street"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Enter street address"
												{...field}
												className="input bg-gray-200/60"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex space-x-4 w-full">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input
													placeholder="Enter city"
													{...field}
													className="input bg-gray-200/60"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input
													placeholder="Enter state"
													{...field}
													className="input bg-gray-200/60"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Enter country"
												{...field}
												className="input bg-gray-200/60"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postalCode"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Enter postal code"
												{...field}
												className="input bg-gray-200/60"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-center w-full">
							<Button
								type="submit"
								className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md w-full">
								{searchParams.type === "create"
									? "Complete Profile"
									: "Update Profile"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default AddressForm;