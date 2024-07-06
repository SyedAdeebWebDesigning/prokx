import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import Link from "next/link";

interface BannerProps {}

const Banner = ({}: BannerProps) => {
	return (
		<section className="bg-dotted-pattern bg-primary/[0.05] sm:pt-40 py-10 overflow-hidden">
			<MaxWidthWrapper>
				<div className="grid grid-cols-1 lg:grid-cols-2 ">
					<div className="relative md:size-[700px] rotate-45 mt-16 lg:order-2 lg:ml-auto mx-auto hidden lg:flex z-0 -mr-80 ">
						<Image
							src={"/banner-image.png"}
							fill
							alt="banner"
							loading="eager"
						/>
					</div>
					<div className="flex flex-col sm:w-2/3 lg:w-full mx-auto lg:order-1 z-10">
						<div className="">
							<h2 className="text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[5.6rem] font-medium">
								Discover Your Style with high quality <br />
								<span className="text-primary lg:text-shadow font-semibold">
									Premium Merchandise
								</span>
								.
							</h2>
							<br />
							<h3 className="text-lg text-gray-500 md:text-3xl font-normal -mt-5">
								Over 1000+ satisfied customers worldwide
							</h3>
						</div>
						<div className="flex flex-col md:flex-row mt-8 gap-2 justify-normal">
							<Link href={"/products?page=1"}>
								<Button
									size={"lg"}
									variant={"default"}
									className="rounded-sm py-4">
									Shop Now
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</section>
	);
};

export default Banner;
