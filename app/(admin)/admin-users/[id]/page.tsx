"use client";

import { Button } from "@/components/ui/button";
import { addAdmin, getUserById, removeAdmin } from "@/lib/actions/user.action";
import User from "@/lib/database/models/User.model";
import { formatDateTime } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PageProps {}

const Page = ({}: PageProps) => {
  const { id } = useParams();
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id as string);
        setUser(userData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div>
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  const handleToggleAdmin = async (user: User) => {
    try {
      if (user.isAdmin) {
        // Remove admin
        const result = await removeAdmin(user._id as string); // Assuming _id is used for identification
        if (result.success) {
          toast.success("Admin privileges removed successfully");
        } else {
          toast.error(result.message);
        }
      } else {
        // Make admin
        const result = await addAdmin(user._id as string); // Assuming _id is used for identification
        if (result.success) {
          toast.success("User granted admin privileges");
        } else {
          toast.error(result.message);
        }
      }
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast.error("An error occurred while toggling admin status");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      {user ? (
        <div className="w-full rounded bg-gray-50 p-6 shadow-md md:mx-auto md:w-1/2">
          <h1 className="mb-4 text-center text-xl font-bold">User Details</h1>
          <div className="line-clamp-1">
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">id:</span> {user.clerkId}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">email:</span> {user.email}
            </p>
            <p aria-hidden className="my-2 w-full border-2 text-gray-400" />
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Name:</span>{" "}
              {user?.firstName} {user?.lastName}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Street:</span>{" "}
              {user.address?.street || "-"}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">City:</span>{" "}
              {user.address?.city || "-"}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Country:</span>{" "}
              {user.address?.country || "-"}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Postal Code:</span>{" "}
              {user.address?.postalCode || "-"}
            </p>
            <p aria-hidden className="my-2 w-full border-2 text-gray-400" />
            {user.isOwner ? (
              <p className="flex justify-start">
                <span className="mr-2 font-semibold">Status:</span> Owner
              </p>
            ) : (
              <p className="flex justify-start">
                <span className="mr-2 font-semibold">Status:</span>{" "}
                {user.isAdmin ? "Admin" : "User"}
              </p>
            )}
            <p aria-hidden className="my-2 w-full border-2 text-gray-400" />
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Created At:</span>{" "}
              {formatDateTime(user.createdAt as any).dateTime}
            </p>
            <p className="flex justify-start">
              <span className="mr-2 font-semibold">Updated At:</span>{" "}
              {formatDateTime(user.updatedAt as any).dateTime}
            </p>
            <Button
              className="mt-4 w-full rounded bg-primary"
              onClick={() => handleToggleAdmin(user)}
            >
              {user.isAdmin ? "Remove Admin" : "Make Admin"}
            </Button>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </main>
  );
};

export default Page;
