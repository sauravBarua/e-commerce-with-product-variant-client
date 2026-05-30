"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import { IProduct } from "@/types/inventory.types";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shared/ProductCard";

const tabs = ["New Arrival", "Bestseller", "Featured Products"];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
  });

  const products: IProduct[] = data?.data ?? [];

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-20 py-12">
      {/* Tabs */}
      <div className="flex gap-8 mb-10 overflow-x-auto scroll-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-sm font-medium pb-2 whitespace-nowrap transition-colors ${
              activeTab === i
                ? "border-b-2 border-black text-black"
                : "text-mc-secondary-text hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 py-12">
          Failed to load products. Please try again.
        </p>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 && (
            <p className="col-span-4 text-center text-mc-secondary-text py-12">
              No products found.
            </p>
          )}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlisted.has(product.id)}
              onWishlistToggle={toggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductTabs;

