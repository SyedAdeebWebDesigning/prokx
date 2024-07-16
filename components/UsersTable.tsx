"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtered users based on search query
  const filteredUsers = users?.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.clerkId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle row click action
  const handleRowClick = (userId: string) => {
    // Implement navigation logic here, for example:
    router.push(`/admin-users/${userId}`);
    console.log(`Clicked user ID: ${userId}`);
  };

  return (
    <div className="overflow-x-auto">
      {/* Search input */}
      <div className="mb-4 flex justify-center">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search users by Name, Email, or ID..."
          className="m-2 w-full rounded border bg-gray-50 px-4 py-2 shadow-sm"
        />
      </div>

      <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader className="bg-slate-100">
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
          {filteredUsers.map((user, index) => (
            <TableRow
              key={user.id}
              className={cn(
                "cursor-pointer hover:bg-transparent",
                index % 2 !== 0 ? "bg-slate-100 hover:bg-slate-100" : "",
              )}
              onClick={() => handleRowClick(user.clerkId)} // Handle row click
            >
              <TableCell className="font-medium">{index + 1}.</TableCell>
              <TableCell className="line-clamp-1">{user.clerkId}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                {user.address?.postalCode || "-"}
              </TableCell>
              <TableCell
                className={cn("text-right", {
                  "font-semibold text-yellow-600": user.isOwner,
                  "font-semibold text-green-600": user.isAdmin && !user.isOwner,
                  "text-gray-600": !user.isAdmin && !user.isOwner,
                })}
              >
                {user.isOwner ? "Owner" : user.isAdmin ? "Admin" : "User"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
