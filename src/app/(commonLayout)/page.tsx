
import BrowseByCategory from "@/components/modules/Home/BrowseByCategory";
import DiscountsSection from "@/components/modules/Home/DiscountsSection";
import HeroSection from "@/components/modules/Home/HeroSection";
import HomeFooter from "@/components/modules/Home/HomeFooter";
import MainHeader from "@/components/modules/Home/MainHeader";
import PopularProducts from "@/components/modules/Home/PopularProducts";
import ProductBento from "@/components/modules/Home/ProductBento";
import ProductTabs from "@/components/modules/Home/ProductTabs";
import SummerSaleBanner from "@/components/modules/Home/SummerSaleBanner";

export default function Home() {
  return (
    <div className="bg-white text-black font-sans overflow-x-hidden">
      <MainHeader />
      <HeroSection />
      <ProductBento />
      <BrowseByCategory />
      <ProductTabs />
      <PopularProducts />
      <DiscountsSection />
      <SummerSaleBanner />
      <HomeFooter />
    </div>
  );
}


