import Heading from "@/components/Heading";
import ProductHeader from "@/components/ProductHeader";
import ProductsTable from "@/components/ProductsTable";
import { getAllProducts } from "@/lib/actions/product.action";

interface adminProductsPageProps {}

const adminProductsPage = async ({}: adminProductsPageProps) => {
  const products = await getAllProducts();
  return (
    <main className="mb-10">
      <ProductHeader />
      <Heading>Products</Heading>
      <ProductsTable products={products} />
    </main>
  );
};

export default adminProductsPage;
