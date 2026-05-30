import Link from "next/link";

const services = [
  "Bonus program",
  "Gift cards",
  "Credit and payment",
  "Service contracts",
  "Non-cash account",
  "Payment",
];

const buyerLinks = [
  "Find an order",
  "Terms of delivery",
  "Exchange and return of goods",
  "Guarantee",
  "Frequently asked questions",
  "Terms of use of the site",
];

const HomeFooter = () => {
  return (
    <footer className="bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-20 py-20 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="md:col-span-4 space-y-6">
          <div className="text-3xl font-black">cyber</div>
          <p className="text-mc-secondary-fixed-dim text-base leading-relaxed">
            We are a residential interior design firm located in Portland. Our
            boutique-studio offers more than
          </p>
          <div className="flex gap-6 pt-4">
            {["twitter", "facebook", "tiktok", "instagram"].map((social) => (
              <Link
                key={social}
                href="#"
                aria-label={social}
                className="w-6 h-6 bg-mc-secondary-fixed-dim rounded-full hover:opacity-70 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-bold mb-2">Services</h4>
          <ul className="space-y-3">
            {services.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-mc-secondary-fixed-dim hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Assistance */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-bold mb-2">Assistance to the buyer</h4>
          <ul className="space-y-3">
            {buyerLinks.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-mc-secondary-fixed-dim hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-20 py-8 border-t border-white/10 max-w-7xl mx-auto">
        <p className="text-mc-secondary-fixed-dim text-sm">
          © 2024 Cyber. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
