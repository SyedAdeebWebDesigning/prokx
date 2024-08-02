import Heading from "@/components/Heading";
import { OrderStatusComponent } from "@/components/OrderStatusComponent";
import { getOrderById, updateOrderStatus } from "@/lib/actions/orders.action";
import { IOrder } from "@/lib/database/models/Orders.model";
import { CheckCheckIcon, LucideTimer, Warehouse, X } from "lucide-react";
import { toast } from "react-toastify";

interface OrderPageProps {
  params: {
    id: string;
  };
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const data = await getOrderById(params.id);
  if (!data) {
    // Return 404 page if the order is not found
    return <div>Order not found</div>;
  }
  const order: IOrder = JSON.parse(JSON.stringify(data));

  return (
    <main className="my-10">
      <Heading>Order Details</Heading>
      <section className="mx-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="rounded bg-secondary p-4">
          <h2 className="my-2 text-center text-3xl text-muted-foreground">
            Transaction Details
          </h2>
          <div>
            <h3>Payment Status: {order.paymentStatus}</h3>
            <h3>Order Status: {order.orderStatus}</h3>

            <OrderStatusComponent
              orderId={order._id as string}
              orderStatus={order.orderStatus}
            />
          </div>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2>
            Order ID: <span>{order._id}</span>
          </h2>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2>
            Order ID: <span>{order._id}</span>
          </h2>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2>
            Order ID: <span>{order._id}</span>
          </h2>
        </div>
      </section>
    </main>
  );
};

export default OrderPage;
