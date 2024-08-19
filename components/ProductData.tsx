import { getPublishableProducts } from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";
import ProductCard from "./ProductCard";

interface ProductDataProps {
    category: string
}

const ProductData = async ({category}: ProductDataProps) => {
  const data = await getPublishableProducts();
  const products: IProductDocument[] = JSON.parse(JSON.stringify(data));
  const filteredProducts = category
    ? products.filter(
        (product: IProductDocument) =>
          product.product_category!.toLowerCase() === category.toLowerCase(),
      )
    : products;
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.map((product: IProductDocument, index: number) => {
        return <ProductCard index={index} product={product} isNotCategorized />;
      })}
    </section>
  );
};

export default ProductData;
