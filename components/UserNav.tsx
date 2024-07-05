"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import User from "@/lib/database/models/User.model";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface UserNavProps {
	clerkUser: User;
}

const UserNav = ({ clerkUser }: UserNavProps) => {
	const { signOut } = useAuth();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="relative size-8 cursor-pointer">
					{clerkUser ? (
						<Image
							src={clerkUser.photo}
							alt={`${clerkUser?.username}`}
							fill
							className="rounded-full object-cover object-center"
						/>
					) : (
						<div className="rounded-full size-8 animate-pulse" aria-hidden />
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="bg-gray-100 w-[350px] shadow-xl p-4 rounded-xl"
				align="end">
				<div className="flex items-center justify-start gap-2 p-2 w-full">
					<div className="relative size-8">
						<Image
							src={clerkUser.photo}
							alt={`${clerkUser?.username}`}
							fill
							className="rounded-full object-cover object-center"
						/>
					</div>
					<div className="flex flex-col space-y-0.5 leading-none">
						<p className="font-medium text-sm text-black line-clamp-1">
							{clerkUser?.username}
						</p>
						<p className="font-medium text-sm text-gray-600 line-clamp-1">
							{clerkUser?.email}
						</p>
					</div>
				</div>
				<DropdownMenuSeparator className="bg-gray-300 h-[2px]" />
				<div className="flex flex-col justify-between">
					<div className="my-3">
						<DropdownMenuItem asChild className="cursor-pointer ">
							<Link href={"/user-profile"}>Manage Account</Link>
						</DropdownMenuItem>
						{clerkUser.hasProfileCompleted ? (
							<DropdownMenuItem asChild className="cursor-pointer ">
								<Link href={"/profile?type=update"}>Update your profile</Link>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem asChild className="cursor-pointer ">
								<Link href={"/profile?type=create"}>Complete your profile</Link>
							</DropdownMenuItem>
						)}
					</div>
					<div>
						<DropdownMenuItem>
							<Button
								variant={"destructive"}
								className="cursor-pointer w-full h-7 rounded-full bg-red-500 hover:bg-red-600 focus:bg-red-600"
								onClick={() => signOut()}>
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
