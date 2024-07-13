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
import { useState } from "react";

interface AddressFormProps {
  searchParams: {
    type: "create" | "update";
  };
  user: User;
}

const AddressForm = ({ searchParams, user }: AddressFormProps) => {
  const router = useRouter();
  const [loadingPostalCode, setLoadingPostalCode] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
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
    router.push("/address?type=update");
  } else {
    router.push("/address?type=create");
  }

  const fetchAddressDetails = async (postalCode: string) => {
    try {
      setLoadingPostalCode(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${postalCode}`,
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const { District, State, Country } = data[0].PostOffice[0];
        form.setValue("city", District);
        form.setValue("state", State);
        form.setValue("country", Country);
        toast.success("Address details updated based on postal code");
      } else {
        toast.error("Invalid postal code");
      }
    } catch (error) {
      toast.error("Failed to fetch address details");
    } finally {
      setLoadingPostalCode(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingForm(true);
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
    } finally {
      setLoadingForm(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[80vh] w-1/6 flex-col items-center justify-center">
        <h3 className="text-3xl">User not found</h3>
        <Link
          href={"/sign-in"}
          className={cn("my-4 w-full", buttonVariants({ variant: "default" }))}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[95vh] items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-2xl font-semibold">
          {searchParams.type === "create" ? "Create Address" : "Update Address"}{" "}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-3"
          >
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
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter postal code"
                          {...field}
                          className="input bg-gray-200/60"
                          onBlur={() => fetchAddressDetails(field.value)}
                          disabled={loadingPostalCode || loadingForm}
                        />
                        {loadingPostalCode && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <div className="loader"></div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full space-x-4">
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
                          disabled={loadingPostalCode || loadingForm}
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
                          disabled={loadingPostalCode || loadingForm}
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
                        disabled={loadingPostalCode || loadingForm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="submit"
                className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-600"
                disabled={loadingForm}
              >
                {searchParams.type === "create"
                  ? "Complete Address"
                  : "Update Address"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddressForm;
