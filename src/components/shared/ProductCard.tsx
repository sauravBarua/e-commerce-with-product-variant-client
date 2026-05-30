"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/inventory.types";

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getProductImage(product: IProduct): string {
  for (const cg of product.colorGroups) {
    const primary = cg.images.find((img) => img.isPrimary);
    if (primary) return primary.url;
    if (cg.images[0]) return cg.images[0].url;
  }
  return "/images/placeholder.png";
}

export function getLowestPrice(product: IProduct): string {
  const prices = product.colorGroups
    .flatMap((cg) => cg.variants.map((v) => Number(v.price)))
    .filter((p) => p > 0);
  if (!prices.length) return "N/A";
  const min = Math.min(...prices);
  return `$${min.toLocaleString()}`;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: IProduct;
  wishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  priority?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  wishlisted = false,
  onWishlistToggle,
  priority = false,
  className,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-xl border border-mc-outline-variant bg-white shadow-none hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Clickable image area */}
        <Link href={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative w-full h-52 bg-white overflow-hidden">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Wishlist + Quick View */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); onWishlistToggle?.(product.id); }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  wishlisted ? "fill-red-600 text-red-600" : "text-gray-600"
                )}
              />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Add to Cart overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => e.preventDefault()}
              className="bg-black text-white text-sm font-medium px-5 py-2 rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-opacity-80"
            >
              Add to Cart
            </button>
          </div>
        </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 text-center space-y-2">
          {/* Category */}
          {product.category?.name && (
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {product.category.name}
            </div>
          )}

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            <Link href={`/product/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          {/* Rating */}
          {product.averageRating != null && (
            <div className="flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(Number(product.averageRating ?? 0))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({product.averageRating})
              </span>
            </div>
          )}

          {/* Price */}
          <p
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#72AEC8" }}
          >
            {getLowestPrice(product)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
