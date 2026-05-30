import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-[#211C24] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-20 flex flex-col md:flex-row items-center justify-between min-h-157.5 py-12">
        {/* Text */}
        <div className="flex-1 space-y-4 text-center md:text-left z-10">
          <p className="text-mc-on-secondary-container text-2xl font-medium opacity-60">Pro.Beyond.</p>
          <h1 className="text-white text-[96px] leading-25 tracking-tight">
            <span className="font-thin">IPHONE 14</span>{" "}
            <span className="font-bold">Pro</span>
          </h1>
          <p className="text-mc-on-secondary-container text-lg max-w-sm opacity-60">
            Created to change everything for the better. For everyone
          </p>
          <div className="pt-8">
            <Link
              href="#"
              className="border border-white text-white px-14 py-4 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative mt-12 md:mt-0 flex justify-center items-center">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl3xpqHmFfxSnZIfmql0g6Zs8P0D1mQvsC8XPDjT0AxIaZvF-1VVGCDldlp3JfRt3R43fnItcmXkZMkHMPyEp_0vA7ubd7kA21PwYMZSke7cfl4Bj_VkRhn__62YI9e_9H0ltET7LmNEPwl7FI6_jVmlQOipvJ_ADA3Sl9BZOoa0Ipk6_hJXb1dcJZ9oGzz3ANgAKktC4fsqTE5lGl-KsF1_PwD7iOKr0XLDnE-yMACjrRvJnjDTnG6bPZ63qvYWn5c-UM801mlndx"
            alt="iPhone 14 Pro"
            width={500}
            height={600}
            className="max-h-150 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
