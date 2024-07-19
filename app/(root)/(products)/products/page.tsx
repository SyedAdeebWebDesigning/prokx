import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCard from "@/components/ProductCard";
import {
  getProductsByCategory,
  getPublishableProducts,
} from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";

interface productsPageProps {}

const productsPage = async ({}: productsPageProps) => {
  const data = await getPublishableProducts();
  const products = JSON.parse(JSON.stringify(data));
  console.log(products);
  if (products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">No products found</h1>
      </div>
    );
  }
  return (
    <main className="my-20">
      <Heading>Products Collections </Heading>
      <MaxWidthWrapper>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: IProductDocument, index: number) => {
            return <ProductCard index={index} product={product} />;
          })}
        </section>
      </MaxWidthWrapper>
    </main>
  );
};

export default productsPage;
