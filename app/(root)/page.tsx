import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import Heading from "@/components/Heading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { CircleCheckBig, TruckIcon, Leaf, Plane } from "lucide-react";

export default function Home() {
  return (
    <main className="">
      <Banner />
      <section id="categories">
        <Categories />
      </section>
      <section className="bg-white py-10">
        <MaxWidthWrapper>
          <Heading>Why Choose Us?</Heading>
          <div className="mx-auto grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded bg-zinc-100 p-4">
              <CircleCheckBig className="size-12 rounded-full bg-primary/30 p-2" />
              <h2 className="my-2 text-3xl">Quality Products</h2>
              <p className="text-center text-sm">
                We ensure that our products are of the highest quality and that
                our products are not too expensive to produce.
              </p>
            </div>
            <div className="flex flex-col items-center rounded bg-zinc-100 p-4">
              <TruckIcon className="size-12 rounded-full bg-orange-300/70 p-2" />
              <h2 className="my-2 text-3xl">Fast Delivery</h2>
              <p className="text-center text-sm">
                We provide fast delivery services to ensure that our customers
                receive the best possible delivery services. We also provide
                free shipping.
              </p>
            </div>

            <div className="flex flex-col items-center rounded bg-zinc-100 p-4">
              <Leaf className="size-12 rounded-full bg-emerald-700/30 p-2" />
              <h2 className="my-2 text-3xl">Eco Friendly</h2>
              <p className="text-center text-sm">
                We are committed to providing eco-friendly products and services
                to our customers to ensure a sustainable future.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
