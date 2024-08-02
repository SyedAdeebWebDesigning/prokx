"use client";

import {
  updateOrderStatus,
  updatePaymentStatus,
} from "@/lib/actions/orders.action";
import {
  CheckCheckIcon,
  IndianRupeeIcon,
  LucideTimer,
  Warehouse,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const OrderStatusComponent = ({
  orderId,
  paymentStatus,
  orderStatus,
}: {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const statusItems = [
    {
      label: "Item left from Warehouse",
      icon: <Warehouse />,
      bgColor: "bg-orange-200",
    },
    {
      label: "Arriving Today",
      icon: <LucideTimer />,
      bgColor: "bg-blue-200",
    },
    {
      label: "Order Delivered",
      icon: <CheckCheckIcon />,
      bgColor: "bg-green-200",
    },
    {
      label: "Order Canceled",
      icon: <X />,
      bgColor: "bg-red-200",
    },
  ];

  const paymentStatusText = paymentStatus;

  const handleOrderStatus = async (orderStatus: string, orderId: string) => {
    try {
      setIsLoading(true);
      const data = await updateOrderStatus(orderId, orderStatus);
      toast.success(`Order status updated: ${data.orderStatus}`);
    } catch (error) {
      toast.error(`Error updating order status`);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  const handlePaymentStatus = async (
    paymentStatus: string,
    orderId: string,
  ) => {
    try {
      setIsLoading(true);
      const data = await updatePaymentStatus(orderId, paymentStatus);
      toast.success(`Payment status updated: ${data.paymentStatus}`);
    } catch (error) {
      toast.error(`Error updating payment status`);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return (
    <div className="grid w-fit grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
      {statusItems.map((item, index) => (
        <button
          onClick={() => handleOrderStatus(item.label, orderId)}
          disabled={item.label === orderStatus || isLoading}
          key={index}
          className={`flex size-32 cursor-pointer flex-col items-center justify-center space-y-2 disabled:opacity-40 ${item.bgColor} scale-95 transition-all duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-95`}
        >
          {item.icon}
          <p className="text-center text-sm">{item.label}</p>
        </button>
      ))}
      <button
        onClick={() => handlePaymentStatus("paid", orderId)}
        disabled={paymentStatus === "paid" || isLoading}
        className={`flex size-32 scale-95 cursor-pointer flex-col items-center justify-center space-y-2 bg-green-100 transition-all duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-95`}
      >
        <IndianRupeeIcon />
        <p className="px-1 text-center text-sm">
          {paymentStatusText !== "paid"
            ? "Click if payment is successful"
            : "Item is paid"}
        </p>
      </button>
    </div>
  );
};
