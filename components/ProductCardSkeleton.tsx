const ProductCardSkeleton = (key: any) => {
  return (
    <div
      key={key}
      className="cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-80 w-full animate-pulse rounded bg-gray-300"></div>
        <div className="w-full bg-gradient-to-b from-transparent to-gray-100 p-5">
          <div className="flex w-full items-center justify-between py-2">
            <div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>{" "}
              {/* Title Placeholder */}
            </div>
            <div className="h-4 w-1/4 animate-pulse rounded bg-gray-300"></div>{" "}
            {/* Price Placeholder */}
          </div>
          <div className="mt-4 h-12 w-full animate-pulse rounded bg-gray-300"></div>{" "}
          {/* Description Placeholder */}
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="h-4 w-8 animate-pulse rounded-full bg-gray-300"></div>{" "}
              {/* Size Placeholder */}
              <div className="h-4 w-8 animate-pulse rounded-full bg-gray-300"></div>{" "}
              {/* Size Placeholder */}
              <div className="h-4 w-8 animate-pulse rounded-full bg-gray-300"></div>{" "}
              {/* Size Placeholder */}
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="size-4 h-4 w-4 animate-pulse rounded-full bg-gray-300"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
