import MainHeader from "@/components/modules/Home/MainHeader";
import HomeFooter from "@/components/modules/Home/HomeFooter";
import CartPageClient from "./CartPageClient";

export const metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1">
        <CartPageClient />
      </div>
      <HomeFooter />
    </div>
  );
}
