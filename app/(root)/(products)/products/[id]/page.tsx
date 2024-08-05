import { getProductById } from "@/lib/actions/product.action";
import ProductPage from "@/components/ProductPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { IProductDocument } from "@/lib/database/models/Product.model";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const product: IProductDocument = await getProductById(params.id);
  const category = product.product_category;
  return (
    <main>
      <ProductPage paramsId={params.id} product={product} />
      <MaxWidthWrapper>
        <div className="flex w-full items-center justify-center">
          <Tabs defaultValue="related" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="related" className="w-1/2">
                Show Related {category}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="w-1/2">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="related">{/* RelatedProducts */}</TabsContent>
            <TabsContent value="reviews">Change your reviews here.</TabsContent>
          </Tabs>
        </div>
      </MaxWidthWrapper>
    </main>
  );
};

export default Page;
