"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Package,
  Building2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProduct, IProductColorGroup, IProductVariant } from "@/types/inventory.types";
import ProductReviews from "@/components/modules/ProductDetails/ProductReviews";
import RelatedProducts from "@/components/modules/ProductDetails/RelatedProducts";

interface Props {
  product: IProduct;
}

export default function ProductDetailsClient({ product }: Props) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const colorGroup: IProductColorGroup =
    product.colorGroups[selectedColorIdx] ?? product.colorGroups[0];
  const variant: IProductVariant =
    colorGroup?.variants[selectedVariantIdx] ?? colorGroup?.variants[0];
  const images = colorGroup?.images ?? [];
  const activeImage = images[activeImgIdx]?.url ?? "/images/placeholder.png";

  const handleColorSelect = (idx: number) => {
    setSelectedColorIdx(idx);
    setSelectedVariantIdx(0);
    setActiveImgIdx(0);
  };

  const getVariantLabel = (v: IProductVariant) =>
    v.attributes.map((a) => a.value).join(" / ") || v.sku || "Option";

  const price = variant?.price
    ? `$${Number(variant.price).toLocaleString()}`
    : "N/A";

  const stock = variant?.inventory
    ? variant.inventory.quantity - variant.inventory.reservedQuantity
    : 0;

  const stars = Math.round(Number(product.averageRating ?? 0));

  const description = product.description ?? "";
  const descDisplay =
    description.length > 200 && !showFullDesc
      ? description.slice(0, 200) + "..."
      : description;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* ── Breadcrumbs ─────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex text-sm text-mc-secondary-text mb-12">
        <ol className="flex items-center flex-wrap gap-1">
          {[
            { label: "Home", href: "/" },
            { label: "Catalog", href: "/products" },
            { label: product.category.name, href: `/category/${product.category.id}` },
            { label: product.brand.name, href: `/brand/${product.brand.id}` },
          ].map((crumb) => (
            <li key={crumb.label} className="flex items-center gap-1">
              <Link href={crumb.href} className="hover:text-black transition-colors">
                {crumb.label}
              </Link>
              <span className="text-mc-outline-variant px-1">/</span>
            </li>
          ))}
          <li className="font-medium text-black">{product.name}</li>
        </ol>
      </nav>

      {/* ── Product Intro ────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-120 scroll-hide shrink-0">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImgIdx(i)}
                  className={cn(
                    "relative w-20 h-20 shrink-0 rounded-xl border-2 p-1 transition-colors overflow-hidden",
                    activeImgIdx === i
                      ? "border-black"
                      : "border-mc-outline-variant hover:border-gray-400"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="grow relative min-h-80 bg-mc-surface-low rounded-2xl overflow-hidden p-8">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* Purchase Panel */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-3">
            {product.name}
            {colorGroup?.colorValue && (
              <span className="text-mc-secondary-text font-normal">
                {" "}— {colorGroup.colorValue}
              </span>
            )}
            {variant?.attributes.find((a) => a.key === "storage")?.value && (
              <span className="text-mc-secondary-text font-normal">
                {" "}— {variant.attributes.find((a) => a.key === "storage")?.value}
              </span>
            )}
          </h1>

          {/* Rating */}
          {product.averageRating != null && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < stars
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-mc-secondary-text">
                ({Number(product.averageRating).toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span
              className="text-3xl font-bold"
              style={{ color: "#72AEC8" }}
            >
              {price}
            </span>
          </div>

          {/* Color Selection */}
          {product.colorGroups.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-medium mb-3">
                Select color:{" "}
                <span className="font-normal text-mc-secondary-text">
                  {colorGroup?.colorValue}
                </span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.colorGroups.map((cg, i) => (
                  <button
                    key={cg.id}
                    onClick={() => handleColorSelect(i)}
                    style={{ backgroundColor: cg.colorCode ?? cg.colorValue }}
                    title={cg.colorValue}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all border",
                      selectedColorIdx === i
                        ? "ring-2 ring-offset-2 ring-black"
                        : "ring-1 ring-mc-outline-variant hover:ring-gray-400"
                    )}
                    aria-label={`Color ${cg.colorValue}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variant Selection */}
          {colorGroup?.variants.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {colorGroup.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIdx(i)}
                    className={cn(
                      "py-2.5 px-4 border rounded-lg text-sm font-medium transition-all",
                      selectedVariantIdx === i
                        ? "border-black text-black bg-white"
                        : "border-mc-outline-variant text-mc-secondary-text hover:border-black hover:text-black"
                    )}
                  >
                    {getVariantLabel(v)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs Grid */}
          {variant?.attributes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {variant.attributes.slice(0, 6).map((attr) => (
                <div key={attr.id} className="bg-mc-surface-low p-3 rounded-xl">
                  <p className="text-[10px] text-mc-secondary-text uppercase tracking-wide">
                    {attr.key}
                  </p>
                  <p className="text-sm font-semibold mt-0.5">{attr.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-mc-secondary-text leading-relaxed mb-8">
              {descDisplay}
              {description.length > 200 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="text-black font-semibold underline ml-1"
                >
                  {showFullDesc ? "less..." : "more..."}
                </button>
              )}
            </p>
          )}

          {/* CTAs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="flex-1 py-4 border border-black rounded-lg font-medium hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Heart
                className={cn("h-4 w-4", wishlisted && "fill-current")}
              />
              {wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button className="flex-1 py-4 bg-black text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                icon: <Package className="w-5 h-5" />,
                label: "Free Delivery",
                sub: "1–2 days",
              },
              {
                icon: <Building2 className="w-5 h-5" />,
                label: stock > 0 ? "In Stock" : "Out of Stock",
                sub: stock > 0 ? `${stock} left` : "—",
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                label: "Guaranteed",
                sub: "1 year",
              },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-[11px]">
                <div className="bg-mc-surface-low p-2 rounded-lg text-mc-secondary-text shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="text-mc-secondary-text">{b.label}</p>
                  <p className="font-bold">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Details Section ──────────────────────────────────── */}
      <section className="bg-mc-surface-low rounded-3xl p-8 lg:p-12 mb-20">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Details</h2>
          {description && (
            <p className="text-mc-secondary-text text-sm leading-relaxed mb-10">
              {description}
            </p>
          )}
          {variant?.attributes.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg border-b border-mc-outline-variant pb-4 mb-6">
                  Specifications
                </h3>
                <div className="space-y-4 text-sm">
                  {variant.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between">
                      <span className="text-mc-secondary-text">{attr.key}</span>
                      <span className="font-medium text-right">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────── */}
      <ProductReviews averageRating={Number(product.averageRating ?? 0)} />

      {/* ── Related Products ─────────────────────────────────── */}
      <RelatedProducts currentProductId={product.id} />
    </main>
  );
}
