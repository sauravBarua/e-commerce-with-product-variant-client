import Image from "next/image";
import Link from "next/link";

const SummerSaleBanner = () => {
  return (
    <section className="relative h-112.5 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIFtMV8fhJ8NXA2TFqvmfhwANSw9dSn-8t20DYW64ySTtTHMaRGkSYE4IzEhsOwCQyMbrVCXBsh_wNTUgEFs8BZeW0vfJkk-zRb7_zEWIksU5wZfwTIYfn1fc5MRev5rBdtVkh1o2tKqFiHZFYLHCrpDyIFiT1rgUPSj_Tb8cg-21WaKA9ymBd0yx3RijUOPiYjg0-iPNelFEdniDxkyilTkQvWd58cJdmNr--Yfn3ViUUHZtWR8Dvb5nYoGA9CQeUdZKD_J5xlLSREwa')`,
        }}
      />

      {/* Floating decor images */}
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHg2rlcitQiExAWwjZN8P6UNNIv5Y3GWnDsB3dOezhnXYyR_x0_aCKJSMgKFe4RAYgcSbW0aC3zMnT2XMSGu_MXyKZQR29zqZgobEsggwLtb0Z1Y7vH5FRp7nXTMrrzIjrr3xKn2gbQZjp4_ArCX5ug8elQfazi-Yb48jljtYiz5OVTFH9oapCbp68Zg66tnt23p1TiPxUvqG0zHysJoeAcgmOSx3F9KsmmQ-yva_O5IJ8UqcM8sLtHVKrMn60fuybwA-7iHuUayax"
        alt="Sale decoration"
        width={320}
        height={320}
        className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 hidden lg:block"
      />
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCek2zIdiqmHdQMGkkdt7eUoZL7yYZkhFOUTQHQkHDmbBXevx5lW0FmmVsIa2edJZjF1wkYsMTh8ndtb5ztcdv7VIwuYH3ZVAfRFCNGG3lFtQCHf-ag2x92BoNAdRW2edmFKArJS6UtymfzpxUjKSqMnX-3W3INz4uVa5Gqy79fQFO4alg9Qz7DKRtjWRY7jFW7ax0dygclYhymN92THMc3gIuITdXNtmaFOJq785KYw1pMEx5jRy0bzz41uEc3cjBn0dSE_7Ia3wSY"
        alt="Sale decoration"
        width={256}
        height={256}
        className="absolute left-1/4 -bottom-20 w-64 hidden lg:block"
      />
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5ACjPBTnSjT7MjO-hH9QQwzJaeiyllAp6fBV7jKvNjn7hMFBdcJ-MlsT6EZTfQbvItND81EbEkA3Wdl_F0TBIod0zrBDWyUPxqn_xwa2lU_lZofWZeFUnwghV4zBmysGjMT-H4WOgMgHB50jTt0HoVwC_rK9TvLt8oqqb27EcNa0fiwbxiBggUUHbS1D7b9anpHYFYdl4G6zMygV87gh4h-3Qp0K0bopVVQAcwLYah1Fpal4WQKT4CWHEw5sSYWTj-A_iUoJ6H5Mu"
        alt="Sale decoration"
        width={320}
        height={320}
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 hidden lg:block"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-white text-[64px] leading-18 font-thin">
          Big Summer <span className="font-bold">Sale</span>
        </h2>
        <p className="text-mc-on-secondary-container mt-4 max-w-lg">
          Commodo fames vitae vitae leo mauris in. Eu consequat.
        </p>
        <Link
          href="#"
          className="mt-10 border border-white text-white px-12 py-4 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-all inline-block"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default SummerSaleBanner;
