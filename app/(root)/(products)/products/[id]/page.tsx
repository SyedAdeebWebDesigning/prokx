import { getProductById } from "@/lib/actions/product.action";
import ProductPage from "@/components/ProductPage";

interface PageProps {
  params: {
    id: string;
  };
}


const Page = async ({ params }: PageProps) => {
  const product = await getProductById(params.id);

  return (
    <main>
      <ProductPage paramsId={params.id} product={product} />
    </main>
  );
};

export default Page;
