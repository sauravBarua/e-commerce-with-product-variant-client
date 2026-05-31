"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/inventory.types";
import { IBrand } from "@/types/brand.types";
import { ICategory } from "@/types/category.types";
import { PaginationMeta } from "@/types/api.types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getProductImage(product: IProduct): string {
  const cg = product.colorGroups[0];
  if (!cg) return "/images/placeholder.png";
  return (
    cg.images.find((i) => i.isPrimary)?.url ??
    cg.images[0]?.url ??
    "/images/placeholder.png"
  );
}

function getProductMinPrice(product: IProduct): string {
  const prices = product.colorGroups
    .flatMap((cg) => cg.variants)
    .map((v) => Number(v.price))
    .filter((p) => !isNaN(p) && p > 0);
  if (prices.length === 0) return "N/A";
  return `$${Math.min(...prices).toLocaleString()}`;
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: IProduct }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center relative group">
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted(!wishlisted);
        }}
        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
        aria-label="Toggle wishlist"
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            wishlisted && "fill-red-500 text-red-500",
          )}
        />
      </button>

      <Link href={`/product/${product.id}`} className="w-full flex flex-col items-center">
        <div className="relative h-40 w-full mb-6">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-center font-medium text-sm px-2 line-clamp-2 mb-2 min-h-10 w-full">
          {product.name}
        </h3>
      </Link>

      <div className="text-xl font-bold mb-4">{getProductMinPrice(product)}</div>

      <Link
        href={`/product/${product.id}`}
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center"
      >
        Buy Now
      </Link>
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-semibold text-base"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && children && <div className="mt-4">{children}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export interface ProductsPageClientProps {
  products: IProduct[];
  meta: PaginationMeta | null;
  brands: IBrand[];
  categories: ICategory[];
}

export default function ProductsPageClient({
  products,
  meta,
  brands,
  categories,
}: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [brandSearch, setBrandSearch] = useState("");

  // ── Derive current filter state from URL ──────────────────────────────────
  const selectedBrandIds = searchParams.getAll("brandId");
  const selectedCategoryId = searchParams.get("categoryId") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");
  const currentSort = searchParams.get("sort") ?? "";
  const searchQuery = searchParams.get("search") ?? "";

  // ── URL param helper ──────────────────────────────────────────────────────
  const updateParams = (
    updates: Record<string, string | string[] | null>,
    resetPage = true,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    }

    if (resetPage && !("page" in updates)) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const toggleBrand = (id: string) => {
    const next = selectedBrandIds.includes(id)
      ? selectedBrandIds.filter((b) => b !== id)
      : [...selectedBrandIds, id];
    updateParams({ brandId: next.length ? next : null });
  };

  const handleSort = (value: string) => {
    updateParams({ sort: value || null });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get("q") as string).trim();
    updateParams({ search: q || null });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? products.length;

  // Build pagination page numbers with ellipsis
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (p) =>
        p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
    )
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <>
      {/* ── Breadcrumbs ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-32 py-6">
        <nav aria-label="Breadcrumb" className="flex text-sm text-gray-400 gap-2 flex-wrap">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">Products</span>
          {selectedCategoryId && categories.length > 0 && (
            <>
              <span>/</span>
              <span className="text-black font-semibold">
                {categories.find((c) => c.id === selectedCategoryId)?.name}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 md:px-32 pb-20 flex flex-col md:flex-row gap-8">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-full md:w-64 shrink-0">
          {/* Brand filter */}
          <AccordionSection title="Brand" defaultOpen>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-lg pl-9 py-2 text-xs focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {filteredBrands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrandIds.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-medium">{brand.name}</span>
                </label>
              ))}
              {filteredBrands.length === 0 && (
                <p className="text-xs text-gray-400">No brands found</p>
              )}
            </div>
          </AccordionSection>

          {/* Category filter */}
          {categories.length > 0 && (
            <AccordionSection title="Category">
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategoryId === cat.id}
                      onChange={() =>
                        updateParams({
                          categoryId:
                            selectedCategoryId === cat.id ? null : cat.id,
                        })
                      }
                      className="border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </label>
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Placeholder filters */}
          {[
            "Battery capacity",
            "Screen type",
            "Screen diagonal",
            "Protection class",
            "Built-in memory",
          ].map((label) => (
            <AccordionSection key={label} title={label} />
          ))}
        </aside>

        {/* ── Product Listing ──────────────────────────────────────────── */}
        <section className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  name="q"
                  type="text"
                  defaultValue={searchQuery}
                  placeholder="Search products…"
                  className="w-full bg-gray-100 border-none rounded-lg pl-10 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-gray-500 text-sm hidden sm:block">
                {total} result{total !== 1 ? "s" : ""}
              </span>
              <select
                value={currentSort}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-black focus:border-black"
              >
                <option value="">By rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedBrandIds.length > 0 || selectedCategoryId) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedBrandIds.map((id) => {
                const brand = brands.find((b) => b.id === id);
                if (!brand) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleBrand(id)}
                    className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    {brand.name}
                    <span className="text-gray-300">×</span>
                  </button>
                );
              })}
              {selectedCategoryId && (
                <button
                  onClick={() => updateParams({ categoryId: null })}
                  className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {categories.find((c) => c.id === selectedCategoryId)?.name}
                  <span className="text-gray-300">×</span>
                </button>
              )}
              <button
                onClick={() =>
                  updateParams({ brandId: null, categoryId: null })
                }
                className="text-xs text-gray-400 hover:text-black underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading */}
          {isPending && (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          )}

          {/* Empty state */}
          {!isPending && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <PackageSearch className="h-14 w-14 text-gray-200" />
              <p className="text-gray-500 text-sm font-medium">No products found</p>
              <p className="text-xs text-gray-400">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}

          {/* Grid */}
          {!isPending && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isPending && totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  updateParams({ page: String(currentPage - 1) }, false)
                }
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() =>
                      updateParams({ page: String(p) }, false)
                    }
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors",
                      currentPage === p
                        ? "bg-black text-white"
                        : "hover:bg-gray-100 text-gray-700",
                    )}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  updateParams({ page: String(currentPage + 1) }, false)
                }
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
