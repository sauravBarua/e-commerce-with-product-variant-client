import { notFound } from "next/navigation";
import { getProductById } from "@/services/product.services";
import MainHeader from "@/components/modules/Home/MainHeader";
import HomeFooter from "@/components/modules/Home/HomeFooter";
import ProductDetailsClient from "@/components/modules/ProductDetails/ProductDetailsClient";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    const result = await getProductById(id);
    product = result?.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <div className="bg-white text-black font-sans antialiased">
      <MainHeader />
      <ProductDetailsClient product={product} />
      <HomeFooter />
    </div>
  );
}
