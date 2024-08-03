import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/orders.action";
import { getProductById } from "@/lib/actions/product.action";
import { IOrder } from "@/lib/database/models/Orders.model";
import { IProductDocument } from "@/lib/database/models/Product.model";
import { cn, formatCurrency, formatDateTime, formatOrderId } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailProps {
  params: {
    id: string;
  };
}

const OrderDetail = async ({ params }: OrderDetailProps) => {
  const data = await getOrderById(params.id);
  const order: IOrder = JSON.parse(JSON.stringify(data));
  const products = await Promise.all(
    order?.orderDetails?.map((item) => getProductById(item.productId)),
  );
  return (
    <main className="my-20">
      <Heading>Track your order</Heading>
      <MaxWidthWrapper>
        <div className="rounded bg-white p-6">
          <div className="mb-6 flex flex-col">
            <h1 className="text-2xl font-medium text-gray-800">
              Order ID:{" "}
              <span className="text-primary">
                {formatOrderId(order._id as string)}
              </span>
            </h1>
            <p className="text-gray-600">
              {formatDateTime(order.createdAt as Date).dateTime}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-[20vh] overflow-y-scroll rounded bg-gray-50 p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Customer's Cart</h2>
              {order.orderDetails.map((item, index) => {
                const product: IProductDocument = products[index];
                const productVariant = product?.product_variants.find(
                  (variant: any) => variant.color_name === item.productColor,
                );
                const productImage = productVariant?.images[0]?.url;

                return (
                  <Link
                    href={`/products/${product._id}?size=${item.productSize}&color=${item.productColor}`}
                    key={item.productId}
                    className="flex cursor-pointer items-center border-b border-gray-200 px-4 py-4 last:border-b-0 hover:bg-gray-100"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 md:h-24 md:w-24">
                      <Image
                        fill
                        className="h-full w-full rounded object-cover"
                        src={productImage as string}
                        alt={item.productTitle}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="line-clamp-2 font-semibold">
                        {item.productTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.productSize}
                      </p>
                      <p className="text-sm text-gray-600">
                        Color: {item.productColor}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium text-gray-800">
                        {item.productQty} x {formatCurrency(item.productPrice)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="relative w-full rounded bg-gray-50 p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Summary</h2>
              <div className="flex justify-between border-b pb-2">
                <p>Shipping</p>
                <p>{formatCurrency(99)}</p>
              </div>
              <div className="flex h-auto flex-col justify-between">
                <div className="mb-full flex justify-between pt-2 font-semibold">
                  <p>Total</p>
                  <p>{formatCurrency(order.orderTotal / 100)}</p>
                </div>
                <div className="absolute bottom-2 left-0 flex w-full items-center justify-center px-2">
                  <Link
                    href={"/products"}
                    className={cn(
                      "w-full",
                      buttonVariants({ variant: "default" }),
                    )}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-span-full rounded bg-gray-50 p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Transaction Status</h2>
              <p>Payment Status: {order.paymentStatus}</p>
              <p>Order Status: {order.orderStatus}</p>
            </div>

            <div className="col-span-full rounded bg-gray-50 p-4 shadow-md">
              <div className="mt-4">
                <h3 className="font-semibold">Shipping Address</h3>
                <br />
                <p className="text-sm text-gray-600">
                  {order.orderAddress.street} {order.orderAddress.city}{" "}
                  {order.orderAddress.state} {order.orderAddress.postalCode}{" "}
                  {order.orderAddress.country}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </main>
  );
};

export default OrderDetail;
