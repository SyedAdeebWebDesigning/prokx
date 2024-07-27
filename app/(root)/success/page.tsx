import Heading from "@/components/Heading";
import { getUserRecentOrder } from "@/lib/actions/orders.action";
import { IOrder } from "@/lib/database/models/Orders.model";
import { User, currentUser } from "@clerk/nextjs/server";

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await currentUser();
  const userId = user?.id;
  const data = await getUserRecentOrder(userId as string);
  const order: IOrder = JSON.parse(JSON.stringify(data));
  console.log(order);

  return (
    <main className="my-20">
      <Heading>Thank you for your order. {order._id}</Heading>
    </main>
  );
};

export default page;
