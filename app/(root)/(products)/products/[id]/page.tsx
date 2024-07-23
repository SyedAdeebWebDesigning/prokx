import { getProductById } from "@/lib/actions/product.action";
import ProductPage from "@/components/ProductPage";

interface PageProps {
  params: {
    id: string;
  };
}

export const ProductSkeleton = () => (
  <main className="my-20">
    <section className="body-font overflow-hidden text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mx-auto flex flex-wrap md:w-4/5">
          <div className="relative w-full md:w-1/2">
            <div className="absolute -top-24 left-0 flex flex-wrap space-x-2 md:-left-24 md:top-0 md:flex-col md:space-x-0 md:space-y-2">
              {Array(4)
                .fill("")
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-20 animate-pulse rounded border-2 border-gray-300 bg-gray-300"
                  ></div>
                ))}
            </div>
            <div className="relative h-96 w-full animate-pulse rounded bg-gray-300 md:h-[500px]"></div>
          </div>
          <div className="mt-6 w-full md:mt-0 md:w-1/2 md:py-6 md:pl-10">
            <div className="mb-2 h-4 w-1/4 animate-pulse bg-gray-300"></div>
            <div className="mb-4 h-8 w-3/4 animate-pulse bg-gray-300"></div>
            <div className="mb-4 h-20 w-full animate-pulse bg-gray-300"></div>
            <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
              <div className="flex space-x-1">
                <span className="mr-3">Color</span>
                {Array(5)
                  .fill("")
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="h-6 w-6 animate-pulse rounded-full border-2 border-gray-300 bg-gray-300"
                    ></div>
                  ))}
              </div>
              <div className="ml-6 flex items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <div className="h-10 w-20 animate-pulse rounded border border-gray-300 bg-gray-300"></div>
                  <span className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center text-center text-gray-600">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-1/4 animate-pulse bg-gray-300"></div>
              <div className="ml-auto h-10 w-1/4 animate-pulse bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

const Page = async ({ params }: PageProps) => {
  const product = await getProductById(params.id);

  return (
    <main>
      <ProductPage paramsId={params.id} product={product} />
    </main>
  );
};

export default Page;
