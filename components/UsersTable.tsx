"use client";

import User from "@/lib/database/models/User.model";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UsersTableProps {
	users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
	const router = useRouter();
	return (
		<Table>
			<TableCaption>A list of users.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="">S.No</TableHead>
					<TableHead>ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead className="text-right">Postal Code</TableHead>
					<TableHead className="text-right">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user, index) => (
					<TableRow
						key={user.id}
						className="cursor-pointer"
						onClick={() => router.push(`/admin-users/${user.clerkId}`)}>
						<TableCell className="font-medium">{index + 1}. </TableCell>
						<TableCell className="line-clamp-1">{user.clerkId}</TableCell>
						<TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell className="text-right">
							{user.address?.postalCode || "-"}
						</TableCell>

						<TableCell
							className={cn("text-right", {
								"text-yellow-600 font-semibold": user.isOwner,
								"text-green-600 font-semibold": user.isAdmin && !user.isOwner,
								"text-gray-600": !user.isAdmin && !user.isOwner,
							})}>
							{user.isOwner ? "Owner" : user.isAdmin ? "Admin" : "User"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default UsersTable;
