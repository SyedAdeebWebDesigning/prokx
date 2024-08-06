import Heading from "@/components/Heading";
import OrdersTable from "@/components/OrdersTable";
import { getOrders } from "@/lib/actions/orders.action";
import { IOrder } from "@/lib/database/models/Orders.model";

interface AdminOrderPageProps {}

const AdminOrderPage = async ({}: AdminOrderPageProps) => {
  const data = await getOrders();
  const orders: IOrder[] = JSON.parse(JSON.stringify(data));
  

  return (
    <main className="my-10">
      <Heading>Orders</Heading>
      <OrdersTable orderDetails={orders}  />
    </main>
  );
};

export default AdminOrderPage;
