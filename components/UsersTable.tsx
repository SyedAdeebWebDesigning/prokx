"use client";

import { useState, useMemo } from "react";
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
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input change
  const handleSearchInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    300,
  );

  // Filtered users based on search query
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users?.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.clerkId.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  // Handle row click action
  const handleRowClick = (userId: string) => {
    router.push(`/admin-users/${userId}`);
    console.log(`Clicked user ID: ${userId}`);
  };

  return (
    <div className="overflow-x-auto">
      {/* Search input */}
      <div className="mb-4 flex justify-center">
        <div className="relative mx-auto w-full">
          <Input
            type="text"
            onChange={handleSearchInputChange}
            placeholder="Search users by Name, Email, or ID..."
            className="m-2 w-full rounded border bg-gray-50 px-4 py-2 pl-10 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400" />
        </div>
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
