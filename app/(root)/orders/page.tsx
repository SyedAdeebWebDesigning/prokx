import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getOrdersByUserClerkId } from "@/lib/actions/orders.action";
import { IOrder } from "@/lib/database/models/Orders.model";
import { formatCurrency, formatOrderId } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

interface OrdersPageProps {}

const OrdersPage = async ({}: OrdersPageProps) => {
  const user = await currentUser();
  const userId = user?.id;
  const data = await getOrdersByUserClerkId(userId as string);
  const orders: IOrder[] = JSON.parse(JSON.stringify(data));

  return (
    <main className="my-20">
      <MaxWidthWrapper>
        <Heading>Your Orders</Heading>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order, i) => (
            <Link
              key={order._id}
              className="relative m-4 border p-4 transition-all duration-100 hover:shadow-md"
              href={`/orders/${order._id}`}
            >
              <h2 className="text-xs font-medium text-primary">
                {formatOrderId(order._id as string)}
              </h2>
              <h2 className="line-clamp-1 text-sm font-semibold">
                {i + 1}. {order.orderDetails[0].productTitle} (
                {order.orderDetails[0].productSize}/
                {order.orderDetails[0].productColor}){" "}
                {order.orderDetails.length > 1 && "and more"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Status: {order.orderStatus}
              </p>
              <p className="text-sm text-muted-foreground">
                Payment Status: {order.paymentStatus}
              </p>
              <p className="text-sm">
                Total: {formatCurrency(order.orderTotal / 100)}
              </p>
              {i === 0 && (
                <div className="absolute right-0 top-0 rounded-bl-full bg-primary/[0.2] px-10 py-1">
                  Recent
                </div>
              )}
            </Link>
          ))}
        </section>
      </MaxWidthWrapper>
    </main>
  );
};

export default OrdersPage;
