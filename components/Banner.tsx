import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import Link from "next/link";

interface BannerProps {}

const Banner = ({}: BannerProps) => {
  return (
    <section className="overflow-hidden bg-primary/[0.05] bg-dotted-pattern py-10 sm:pt-40">
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative z-0 mx-auto -mr-80 mt-16 hidden rotate-45 md:size-[700px] lg:order-2 lg:ml-auto lg:flex">
            <Image
              src={"/banner-image.png"}
              fill
              alt="banner"
              loading="eager"
            />
          </div>
          <div className="z-10 mx-auto flex flex-col sm:w-2/3 lg:order-1 lg:w-full">
            <div className="pt-10">
              <h2 className="text-4xl font-medium sm:text-5xl md:text-[4.5rem] lg:text-[5.6rem]">
                Discover Your Style with high quality <br />
                <span className="lg:text-shadow font-semibold text-primary">
                  Premium Merchandise
                </span>
                .
              </h2>
              <br />
              <h3 className="-mt-5 text-lg font-normal text-gray-500 md:text-3xl">
                Over 1000+ satisfied customers worldwide
              </h3>
            </div>
            <div className="mt-8 flex flex-col justify-normal gap-2 md:flex-row">
              <Link href={"/products?page=1"}>
                <Button
                  size={"lg"}
                  variant={"default"}
                  className="w-full rounded border-2 border-primary py-4 hover:bg-transparent hover:text-gray-800"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href={"#categories"}>
                <Button
                  size={"lg"}
                  variant={"secondary"}
                  className="w-full rounded border-2 border-primary py-4 hover:bg-primary hover:text-white"
                >
                  Browse Categories
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
