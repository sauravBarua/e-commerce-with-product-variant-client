"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import { IProduct } from "@/types/inventory.types";
import ProductCard from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Props {
  currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: Props) {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["products", "related"],
    queryFn: () => getAllProducts(),
  });

  const related: IProduct[] = (data?.data ?? [])
    .filter((p: IProduct) => p.id !== currentProductId)
    .slice(0, 4);

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

  if (isLoading) {
    return (
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!related.length) return null;

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-bold mb-10">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlisted={wishlisted.has(product.id)}
            onWishlistToggle={toggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
