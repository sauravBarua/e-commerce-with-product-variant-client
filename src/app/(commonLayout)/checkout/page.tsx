import MainHeader from "@/components/modules/Home/MainHeader";
import HomeFooter from "@/components/modules/Home/HomeFooter";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1">
        <CheckoutClient />
      </div>
      <HomeFooter />
    </div>
  );
}
