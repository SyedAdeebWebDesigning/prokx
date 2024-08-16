"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation"; // Correct import
import { useEffect, useState } from "react";
import RelatedProducts from "@/components/RelatedProducts";
import ProductReviews from "@/components/ProductReviews";

interface ClientTabsProps {
  productId: string;
  category: string;
}

const ClientTabs = ({ productId, category }: ClientTabsProps) => {
  const router = useRouter(); // Correctly use the useRouter hook
  const [activeTab, setActiveTab] = useState<string>("related");

  //   useEffect(() => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const tab = urlParams.get("tab") || "related";
  //     setActiveTab(tab);
  //   }, []);

  //   const handleTabChange = (value: string) => {
  //     const currentUrl = new URL(window.location.href);
  //     currentUrl.searchParams.set("tab", value);

  //     router.push(currentUrl.pathname + currentUrl.search); // Correct navigation using useRouter
  //     setActiveTab(value);
  //   };

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="related" className="w-1/2">
          Show Related {category}
        </TabsTrigger>
        <TabsTrigger value="reviews" className="w-1/2">
          Reviews
        </TabsTrigger>
      </TabsList>
      <TabsContent value="related">
        <RelatedProducts currentProductId={productId} category={category} />
      </TabsContent>
      <TabsContent value="reviews">
        <ProductReviews productId={productId} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabs;
