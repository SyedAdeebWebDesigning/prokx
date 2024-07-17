import Heading from "@/components/Heading";
import ProductForm from "@/components/ProductForm";
import { getProductById } from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const product = (await getProductById(
    params.id,
  )) as unknown as IProductDocument;
  return (
    <main className="my-20">
      <Heading>{product.product_name}</Heading>
      <ProductForm type="update" product={product} />
    </main>
  );
};

export default page;
