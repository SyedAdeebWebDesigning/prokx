import Heading from "@/components/Heading";
import { OrderStatusComponent } from "@/components/OrderStatusComponent";
import { getOrderById, updateOrderStatus } from "@/lib/actions/orders.action";
import { getProductById } from "@/lib/actions/product.action";
import { IOrder } from "@/lib/database/models/Orders.model";
import { IProductDocument } from "@/lib/database/models/Product.model";
import { formatCurrency } from "@/lib/utils";
import { CheckCheckIcon, LucideTimer, Warehouse, X } from "lucide-react";
import Image from "next/image";
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
  const products = await Promise.all(
    order?.orderDetails?.map((item) => getProductById(item.productId)),
  );

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
              paymentStatus={order.paymentStatus}
              orderStatus={order.orderStatus}
            />
          </div>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2 className="my-2 text-center text-3xl text-muted-foreground">
            Product Details
          </h2>
          <div className="h-[15vh] space-y-2 overflow-y-scroll">
            {order.orderDetails.map((product, index) => {
              const _: IProductDocument = products[index];
              const productVariant = _?.product_variants.find(
                (variant: any) => variant.color_name === product.productColor,
              );
              const productImage = productVariant?.images[0]?.url;
              return (
                <div className="flex items-center justify-start bg-white p-4 shadow-md">
                  <div className="relative size-20">
                    <Image
                      fill
                      src={productImage as string}
                      alt={product.productId}
                      objectFit="contain"
                    />
                  </div>
                  <div key={index} className="flex flex-col justify-between">
                    <h3 className="line-clamp-2">
                      {index + 1}. Name: {product.productTitle} (
                      {product.productSize} / {product.productColor})
                    </h3>
                    <h3>Qty: {product.productQty}</h3>
                    <h3>Price: {formatCurrency(order.orderTotal / 100)}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2 className="my-2 text-center text-3xl text-muted-foreground">
            Shipping Details
          </h2>
          <div>
            <h3>
              {order.orderAddress.street} <br /> {order.orderAddress.city}
              <br />
              {""}
              {order.orderAddress.state}, {order.orderAddress.country}
              <br />
              {order.orderAddress.postalCode}
            </h3>
            <h3></h3>
          </div>
        </div>
        <div className="rounded bg-secondary p-4">
          <h2 className="my-2 text-center text-3xl text-muted-foreground">
            User Details
          </h2>
          <div>
            <h3>User ID: {order.userId}</h3>
            <h3>User Email: {order.userEmail}</h3>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderPage;
