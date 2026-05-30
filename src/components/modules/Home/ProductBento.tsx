import Image from "next/image";
import Link from "next/link";

const ProductBento = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 min-h-150">
      {/* PlayStation 5 */}
      <div className="md:col-span-2 bg-white flex flex-col md:flex-row items-center overflow-hidden p-8 gap-8">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBP3dxJmFfKksrvoUnE1lYneuZS6qG5fDxWlwsh1Jl6hcbgq9Cto5Z_VWznnR6tzNuJ0YY9LqZqd7VeofgWkS97Dal_iWntmbzXXR7U01ReQSdvtycqbwlMsdc6QyssnHbPKHLrLPpmUcoL8Ooq4lPoRW-C14VnfNFwW6t2FRZ_bIvEIqevnkMHlKr_HOH5jbfNYv8MEtfxziJCJxMQh-XfHcjlxrpcdp1jDuusWS6QGrjhRKHqMUJcAUPzSS09mszLaBF6lfmE60Y"
          alt="PS5"
          width={400}
          height={400}
          className="w-full md:w-1/2 object-contain"
        />
        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-10">Playstation 5</h2>
          <p className="text-mc-secondary-text text-base">
            Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will
            redefine your PlayStation experience.
          </p>
        </div>
      </div>

      {/* AirPods Max & Vision Pro */}
      <div className="flex flex-col">
        <div className="bg-mc-surface-low flex flex-col items-center p-8 flex-1 text-center justify-center">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJHws4SPMnI4k5Z1Ei8uhv0suPJEJO4VU6X1NGJt2iKwapXhVGRN36gNY0oauyK6olIQI8J7EWW1xZYtPr8LMyRVYmWbXHUQ8m0y2a02vPXfyWgLGhI0_Pg0AF8bnYp5vfx6WhTxS-XzuomewwvNWpomxdUn2kUHWRkwugiUyQqHbmckRxtPuq8HR-pbvD3q2XXMr31Fzv0HXr7xE4SR_tSqBxzhOB4qATKCE04KCXitdgrjgby1hWUTDlucUd4fgyE1QG6fa3tTV2"
            alt="AirPods Max"
            width={128}
            height={128}
            className="w-32 mb-4"
          />
          <h3 className="text-2xl font-medium">
            Apple AirPods <span className="font-bold">Max</span>
          </h3>
          <p className="text-mc-secondary-text text-sm">
            Computational audio. Listen, it&apos;s powerful
          </p>
        </div>
        <div className="bg-[#353535] text-white flex flex-col items-center p-8 flex-1 text-center justify-center">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOSdXm7lE0hwJ_a8TE9XNT5YgS_4XpHJESSb2aK0w7lxk0uvKHCdHDnpSafz-t5uXXH4yvU6B17PgQBja8PcWtrniIw-Scr7jL-__Nh5Ys-vi8SkOs4QEnJFqh51_HoCrnwbsltfDaR960uWpc9WPGKkSzyjakCPi43luml0_xqEzF7JffZpBRCN7IqdE9JsDTzXdguN86bytoXuaM3yTL-jN0xtNdcGLHDBTMpHEr5q0NnBdf8GIg0rKHYWDr5zeccgTHm705mH10"
            alt="Apple Vision Pro"
            width={192}
            height={192}
            className="w-48 mb-4"
          />
          <h3 className="text-2xl font-medium">
            Apple Vision <span className="font-bold">Pro</span>
          </h3>
          <p className="text-mc-on-secondary-container text-sm">
            An immersive way to experience entertainment
          </p>
        </div>
      </div>

      {/* MacBook Air */}
      <div className="bg-mc-surface flex flex-col items-center justify-center p-12 text-center md:text-left md:items-start relative overflow-hidden">
        <div className="z-10 max-w-xs space-y-4">
          <h2 className="text-3xl font-semibold leading-10">
            Macbook <br />
            <span className="font-bold">Air</span>
          </h2>
          <p className="text-mc-secondary-text text-base">
            The new 15-inch MacBook Air makes room for more of what you love
            with a spacious Liquid Retina display.
          </p>
          <Link
            href="#"
            className="border border-black px-10 py-3 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-all inline-block"
          >
            Shop Now
          </Link>
        </div>
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQSteIyigYo4Lm44r9HPA4VmurFMkvLFgbn8RrufmOo8009xfikoIaYtp7BT3Yd0zsh98VGkh3nzebX-rcYvjF36Uc-g7339rk1032Xh48sd-wNiRscHKl1l_9yBaDoZhUv-xNSYdKzNvGd_5jJRN2QH7c5VPw1mKJbrOMUkq55twaJ_AiyIEJ4VuZe_hswLcagwssBPPirh6hYgaPoX2n1iLzmxb5koJZ7XiZnC8_BmyHeEsFc4Jolzx5fVdPeo-pNtC3-qS0wtdT"
          alt="Macbook Air"
          width={500}
          height={400}
          className="absolute -right-20 bottom-0 w-125"
        />
      </div>
    </section>
  );
};

export default ProductBento;
