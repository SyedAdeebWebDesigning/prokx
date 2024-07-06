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

interface UserNavProps {
	clerkUser: User;
}

const UserNav = ({ clerkUser }: UserNavProps) => {
	const { signOut } = useAuth();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none rounded-full">
				<div className="relative size-8">
					<Image
						className="size-8 bg-blue-100 rounded-full shadow-xl"
						src={clerkUser.photo}
						fill
						alt="User Photo"
					/>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="bg-gray-100 w-[350px] shadow-xl p-4 rounded-xl"
				align="end">
				<div className="flex items-center justify-start gap-2 p-2 w-full">
					<div className="relative size-8">
						<Image
							className="size-8 bg-blue-100 rounded-full shadow-xl"
							src={clerkUser.photo}
							fill
							alt="User Photo"
						/>
					</div>
					<div className="flex flex-col space-y-0.5 leading-none">
						<p className="font-medium text-sm text-black line-clamp-1">
							Manage your account <br />
						</p>
						<span className="text-xs">{clerkUser.email}</span>
					</div>
				</div>
				<DropdownMenuSeparator className="bg-gray-300 h-[2px]" />
				<div className="flex flex-col justify-between">
					<div className="my-3">
						<DropdownMenuItem asChild className="cursor-pointer ">
							<Link href={"/user-profile"}>Update profile</Link>
						</DropdownMenuItem>
						{clerkUser.hasProfileCompleted ? (
							<DropdownMenuItem asChild className="cursor-pointer ">
								<Link href={"/profile?type=update"}>Update your address</Link>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem asChild className="cursor-pointer ">
								<Link href={"/profile?type=create"}>Complete your address</Link>
							</DropdownMenuItem>
						)}
					</div>
					<div>
						<DropdownMenuItem>
							<Button
								variant={"destructive"}
								className="cursor-pointer w-full h-7 rounded-full bg-red-500 hover:bg-red-600 focus:bg-red-600"
								onClick={() => {
									signOut();
									window.location.href = `/sign-in`;
								}}>
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
