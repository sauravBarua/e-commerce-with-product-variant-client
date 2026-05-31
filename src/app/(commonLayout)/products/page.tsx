import { Suspense } from "react";
import { getAllProducts } from "@/services/product.services";
import { getAllBrands } from "@/services/brand.services";
import { getAllCategories } from "@/services/category.services";
import MainHeader from "@/components/modules/Home/MainHeader";
import HomeFooter from "@/components/modules/Home/HomeFooter";
import ProductsPageClient from "@/components/modules/Products/ProductsPageClient";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Products — Cyber" };

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function buildQueryString(
  params: { [key: string]: string | string[] | undefined },
): string {
  const parts: string[] = [];

  const page = params.page as string | undefined;
  const sort = params.sort as string | undefined;
  const search = params.search as string | undefined;
  const categoryId = params.categoryId as string | undefined;
  const brandIds = params.brandId;

  if (page && Number(page) > 1) parts.push(`page=${page}`);
  parts.push("limit=12");
  if (categoryId) parts.push(`categoryId=${encodeURIComponent(categoryId)}`);
  if (search) parts.push(`search=${encodeURIComponent(search)}`);

  if (sort === "price_asc") {
    parts.push("sortBy=price", "sortOrder=asc");
  } else if (sort === "price_desc") {
    parts.push("sortBy=price", "sortOrder=desc");
  } else if (sort === "newest") {
    parts.push("sortBy=createdAt", "sortOrder=desc");
  }

  if (brandIds) {
    const ids = Array.isArray(brandIds) ? brandIds : [brandIds];
    ids.forEach((id) => parts.push(`brandId=${encodeURIComponent(id)}`));
  }

  return parts.join("&");
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const queryString = buildQueryString(params);

  const [productsResult, brandsResult, categoriesResult] =
    await Promise.allSettled([
      getAllProducts(queryString),
      getAllBrands(),
      getAllCategories(),
    ]);

  const products =
    productsResult.status === "fulfilled"
      ? (productsResult.value?.data ?? [])
      : [];
  const meta =
    productsResult.status === "fulfilled"
      ? (productsResult.value?.meta ?? null)
      : null;
  const brands =
    brandsResult.status === "fulfilled"
      ? (brandsResult.value?.data ?? [])
      : [];
  const categories =
    categoriesResult.status === "fulfilled"
      ? (categoriesResult.value?.data ?? [])
      : [];

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          }
        >
          <ProductsPageClient
            products={products}
            meta={meta}
            brands={brands}
            categories={categories}
          />
        </Suspense>
      </div>
      <HomeFooter />
    </div>
  );
}
