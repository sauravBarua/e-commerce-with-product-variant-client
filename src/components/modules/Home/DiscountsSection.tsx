import Image from "next/image";

const discountProducts = [
  {
    id: 1,
    name: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
    price: "$1437",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEmaX0WhQ3BRvTdSkDt1RC-IvnYRaq4sUadlI1DL0k7pkinYoao4tK0HRAz33NKX5_3HdbmStroO8IIMa4J0crJWQxWxian0cRnb68vSgFZnX-y4uwaLcefcUOsAjXV5JY8p4eF_r1uZPqkHgNeoYM3gpiYn8hPR8ryDU8B6ql-ggv98y3VQpLPIs9S2Tf8GWU3PtB5hCagvxLlPj1wVKDjM_JGV39HJzIZsOTtuZMpcjBAnoxgp25L7WjU7CKZau9mvXojP0lnQks",
  },
  {
    id: 2,
    name: "AirPods Max Silver Starlight Aluminium",
    price: "$549",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnLtH4aOhtqF0-Pa6oIpbrg4BeFlbVy-QEL9yv6HF3g9p3lGHn1NmoEanHidICzAySFkDnhILCfHYHjk06E45BilqhMHvZdYjrC6nGFb6HpbsIUXwkUW-bKYlFTipilKyI4ChGYd1ZczyZJJ7qULNkiXgPduAqq0O6wrHxEGXeiHC_upw9UOZ8FFw0TgAKQPj5HoHT5bnOODrfbwcI-e2Te1xTAuQGd9leQfAqtEjPwOGIYgNiFVdwrOYNl6o2Qk_I3w4nxj_NumNx",
  },
  {
    id: 3,
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
    price: "$399",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnSnuehS2zic0sc6eNzlb-EzkKmsAdMQ-DNVDRcJbbZf5fAR8CTct6YhuhxF4q0MpdKWNaagwhu2hDkMLGd-2u-OjtNyf5XUtO3C1ZeuFnP8vL427A0gFC_qtsjvBARH5LyUJ2HXRr8QvvbYZecUHbXRdz2YqaQjy1aAetQJlVA9GF3vmyYTzbMxK32QeiuZRgnFeZ-ALGLYLdyXsHBHRhzWOBQFUnZNswxPsI7mv6jt0hZY-N580GHvXOiSRaCDi4MsnWH-Ugl7dL",
  },
  {
    id: 4,
    name: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
    price: "$1499",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNcYD5bXKjX7C-AF1b0IZmrQCsxM6cqUzHFO-h3_U8EnljagBZdwFSTEdYaAAcAUJOO5tsnWIoXZSQHoRyrjLm-Tqy-9_JB9oEpqwr75iG1IBe9pJYV1vtMuILWzeGBIsmMDffAqLDdxxI09DxR1MNk6RbCxq9vUqVpqwkk7mTzojL3tDsNwUI93sYphCAh0Eq52XfKhXXcUIbXikFFuAiV5vqcL25qmFRL6ZdNLxmyh9kNrb_zmiylehj10Y4rbynXQTrHrv5kxdO",
  },
];

const DiscountsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-20 py-20">
      <h2 className="text-2xl font-bold mb-10 text-center md:text-left">
        Discounts up to -50%
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {discountProducts.map((product) => (
          <div
            key={product.id}
            className="bg-mc-surface-low p-6 rounded-lg flex flex-col items-center text-center"
          >
            <div className="w-full flex justify-end">
              <button className="material-symbols-outlined text-mc-secondary-text">
                favorite
              </button>
            </div>
            <Image
              src={product.image}
              alt={product.name}
              width={160}
              height={160}
              className="h-40 w-auto object-contain my-4"
            />
            <h3 className="text-sm font-medium h-12 flex items-center justify-center">
              {product.name}
            </h3>
            <p className="text-2xl font-semibold mt-2">{product.price}</p>
            <button className="mt-6 w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-opacity-80 transition-all">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountsSection;
