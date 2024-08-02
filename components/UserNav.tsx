"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import User from "@/lib/database/models/User.model";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
interface UserNavProps {
  clerkUser: User;
}

const UserNav = ({ clerkUser }: UserNavProps) => {
  const { signOut } = useAuth();
  const firstLetterOfName = clerkUser?.firstName?.[0] ?? "";
  const lastLetterOfName = clerkUser?.lastName?.[0] ?? "";

  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none">
        <Avatar className="border-4 border-primary/50">
          <AvatarImage
            src={clerkUser?.photo}
            alt="user"
            className="rounded-full"
          />
          <AvatarFallback>
            {firstLetterOfName}
            {lastLetterOfName}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[350px] rounded bg-gray-100 p-4 shadow-xl"
        align="end"
      >
        <div className="flex w-full items-center justify-start gap-2 p-2">
          <div className="relative size-8">
            <Image
              className="size-8 rounded-full bg-blue-100 shadow-xl"
              src={clerkUser?.photo}
              fill
              alt="User Photo"
            />
          </div>
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="line-clamp-1 text-sm font-medium text-black">
              Manage your account <br />
            </p>
            <span className="text-xs">{clerkUser?.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator className="h-[2px] bg-gray-300" />
        <div className="flex flex-col justify-between">
          <div className="my-3">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/user-profile"}>Update profile</Link>
            </DropdownMenuItem>
            {clerkUser?.hasProfileCompleted ? (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/address?type=update"}>Update your address</Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/address?type=create"}>Complete your address</Link>
              </DropdownMenuItem>
            )}
          </div>
          <div>
            <DropdownMenuItem>
              <Button
                variant={"destructive"}
                className="h-9 w-full cursor-pointer rounded bg-red-500 hover:bg-red-600 focus:bg-red-600"
                onClick={() => {
                  signOut();
                  router.push(`/sign-in`);
                }}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
