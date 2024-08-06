import { getRelatedProducts } from "@/lib/actions/product.action";
import { IProductDocument } from "@/lib/database/models/Product.model";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts = async ({
  currentProductId,
  category,
}: RelatedProductsProps) => {
  const data = await getRelatedProducts(category, currentProductId);
  const products: IProductDocument[] = JSON.parse(JSON.stringify(data));

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product._id as string}
            product={product}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
