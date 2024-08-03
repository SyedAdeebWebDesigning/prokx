"use client";

import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import type { IOrder } from "@/lib/database/models/Orders.model";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from "./ui/table";
import { cn, formatCurrency, formatOrderId } from "@/lib/utils";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersTableProps {
  orderDetails: IOrder[];
}

const OrdersTable = ({ orderDetails }: OrdersTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>(orderDetails);

  const debouncedFilterOrders = useMemo(
    () =>
      debounce((query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = orderDetails.filter((order) => {
          return (
            String(order._id).toLowerCase().includes(lowercasedQuery) ||
            order.userEmail.toLowerCase().includes(lowercasedQuery) ||
            (order.paymentStatus &&
              order.paymentStatus.toLowerCase().includes(lowercasedQuery)) ||
            (order.orderStatus &&
              order.orderStatus.toLowerCase().includes(lowercasedQuery))
          );
        });
        setFilteredOrders(filtered);
      }, 300), // Adjust the debounce delay as needed
    [orderDetails],
  );

  useEffect(() => {
    debouncedFilterOrders(searchQuery);
    return () => {
      debouncedFilterOrders.cancel();
    };
  }, [searchQuery, debouncedFilterOrders]);

  if (orderDetails.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl">No orders found</h1>
      </div>
    );
  }

  return (
    <div className="h-[90vh] overflow-y-scroll">
      <div className="mb-4 flex items-center justify-center">
        <div className="relative w-full">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Email, Payment Status, or Order Status"
            className="relative mx-2 bg-slate-50/60 pl-10"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>
      </div>
      <Table className="w-full">
        <TableCaption>A list of orders.</TableCaption>
        <TableHeader className="bg-slate-100">
          <TableRow className="w-full">
            <TableHead className="">S.No</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order, index) => {
            return (
              <TableRow
                key={String(order._id)}
                onClick={() => router.push(`/admin-orders/${order._id}`)}
                className={cn(
                  "cursor-pointer hover:bg-transparent",
                  index % 2 !== 0 ? "bg-slate-100 hover:bg-slate-100" : "",
                )}
              >
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell className="font-medium">
                  {formatOrderId(order._id as string)}
                </TableCell>
                <TableCell>{String(order.userId)}</TableCell>
                <TableCell>{String(order.userEmail)}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(order.orderTotal / 100))}/-
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
