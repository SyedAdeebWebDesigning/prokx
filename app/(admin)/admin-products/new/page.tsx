import Heading from "@/components/Heading";
import ProductForm from "@/components/ProductForm";

interface NewProductPageProps {}

const NewProductPage = async ({}: NewProductPageProps) => {
  return (
    <main className="my-10">
      <Heading>Product Form</Heading>
      <ProductForm />
    </main>
  );
};

export default NewProductPage;
