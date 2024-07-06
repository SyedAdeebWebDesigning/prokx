import Banner from "@/components/Banner";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { CircleCheckBig, TruckIcon, Leaf, Plane } from "lucide-react";

export default function Home() {
	return (
		<main className="">
			<Banner />
			<section className="bg-white py-10">
				<MaxWidthWrapper>
					<h2 className="text-4xl font-bold text-center mb-10">
						Why Choose Us?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto place-items-center gap-4">
						<div className="flex flex-col items-center bg-zinc-100 p-4 rounded-md">
							<CircleCheckBig className="size-12 bg-primary/30 rounded-full p-2" />
							<h2 className="text-3xl my-2">Quality Products</h2>
							<p className="text-center text-sm">
								We ensure that our products are of the highest quality and that
								our products are not too expensive to produce.
							</p>
						</div>
						<div className="flex flex-col items-center bg-zinc-100 p-4 rounded-md">
							<TruckIcon className="size-12 bg-orange-300/70 rounded-full p-2" />
							<h2 className="text-3xl my-2">Fast Delivery</h2>
							<p className="text-center text-sm">
								We provide fast delivery services to ensure that our customers
								receive the best possible delivery services. We also provide
								free shipping.
							</p>
						</div>

						<div className="flex flex-col items-center bg-zinc-100 p-4 rounded-md">
							<Leaf className="size-12 bg-emerald-700/30 rounded-full p-2" />
							<h2 className="text-3xl my-2">Eco Friendly</h2>
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
