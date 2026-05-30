import Image from "next/image";
import Link from "next/link";

const items = [
  {
    bg: "bg-white",
    textColor: "text-black",
    btnClass: "border border-black hover:bg-black hover:text-white",
    title: "Popular Products",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYr3aSeQXT3GfHVRgn4211fNAUH8dEGlAmKb_bv_anKVBKvnQRrXmGc4ax_brSRqA6iyv9LvCGXCysX5baKUTvZDabMzCpK7bpWSzyBbpgQ9WZBnlGlcfM6oesJJhBK1ERBTT1Q6H_P0KkfRTNw9I1iIZkEUBJ0wukE-_22NeXDdUIukqItbL0hMgJ_eu17xx6R_awZSI75WFmx5_5br7Epg9JIG7K3KVjSOqX1lQEql6NJN9PdcRFMhE9mTMmFxbyWkJ7ZMWiCQ_W",
  },
  {
    bg: "bg-mc-surface-low",
    textColor: "text-black",
    btnClass: "border border-black hover:bg-black hover:text-white",
    title: "Ipad Pro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQCUvX6pM0tB-3aXjcVOHIp_Dwi1rFCO2jALkPpLg1q7t4FZZ-nR_CEtNoOi599SuLf4T0tLOR9xy2I-Gq99E2eD2OnC5tbnSPVxMpMt68RHisGt8ExnpjXc1E4av_dRI3nKa_-hd9HFpPZnf8LnKPG-w2SFGiKklQXJoDvGSIgNR6dFeCA7ZoLP0AqYGr0fOzTiWaIb3bzRGjdxQZTPCo5MN5yxMwhTtFjNQtjJdz5HmPZKeHwePj3cdRKpNjPpSiCNZYtLAM_dkA",
  },
  {
    bg: "bg-[#e8e8e8]",
    textColor: "text-black",
    btnClass: "border border-black hover:bg-black hover:text-white",
    title: "Samsung Galaxy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVV0wCQ5O7CWwsgv2U6jtRae8k1vhbTTDG40j30C2UQJcPzqjdsMybblAKmiVRQ1CXJAfe3OyE2yjCMp88XMbx3JdkONgX44s3CFyt58cd3d8YSGDHS_WjHmdqyGjfPeJXnvqz1JHrJbfGQ4RomPreO9Ylri8ZSo-7U6TbWdrBSlkGGFFwk9f583KpU0c-3MDC09kUAL5Oq1Tc2G7bagnxadYh2NOFjhpPj92qrDjbfz9gLp8NIunhHKTgpqeWluXsqksM_c-7wMw2",
  },
  {
    bg: "bg-[#2C2C2C]",
    textColor: "text-white",
    btnClass: "border border-white text-white hover:bg-white hover:text-black",
    title: "Macbook Pro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBi8dy3ZQLcYV1dzY6vgBAzH9tKGc59sPbR-gYsh-S95xEomJDKxI0uOZe7KlsaQ4s-hO1hN4uHgX99NgYb8WJfLtjxeyxodyTk-BNWhdWrtEAkzEAZy-AwOci_ao4fImelAmPkRLSG5HZJI_dzWLJVO-JRUbM0sKPyEhrhYCp5r7SngPd1FIq4SJHVV2SKYeVkO9OFZ2RAXn1DQQPyzfv3L9uUvYd6kjM7m5YADRODf28qvIkAE9_stqAsYrt-aVK1RFiQAWcYsFiY",
  },
];

const PopularProducts = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 min-h-125">
      {items.map((item) => (
        <div
          key={item.title}
          className={`${item.bg} flex flex-col items-start justify-center p-12 space-y-4`}
        >
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={300}
            className="w-full mb-8"
          />
          <h3 className={`text-2xl font-bold ${item.textColor}`}>{item.title}</h3>
          <p className={`text-base ${item.textColor === "text-white" ? "text-mc-on-secondary-container" : "text-mc-secondary-text"}`}>
            iPad combines a magnificent 10.2-inch Retina display, incredible
            performance, multitasking and ease of use.
          </p>
          <Link
            href="#"
            className={`${item.btnClass} px-10 py-3 rounded-lg text-sm font-medium transition-all inline-block`}
          >
            Shop Now
          </Link>
        </div>
      ))}
    </section>
  );
};

export default PopularProducts;
