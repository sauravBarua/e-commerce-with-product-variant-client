"use client";

import { useState } from "react";

const categories = [
  { icon: "smartphone", label: "Phones" },
  { icon: "watch", label: "Smart Watches" },
  { icon: "photo_camera", label: "Cameras" },
  { icon: "headphones", label: "Headphones" },
  { icon: "computer", label: "Computers" },
  { icon: "sports_esports", label: "Gaming" },
];

const BrowseByCategory = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-20 py-20">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-2xl font-bold">Browse By Category</h2>
        <div className="flex gap-4">
          <button className="material-symbols-outlined border border-mc-outline-variant p-2 rounded hover:bg-mc-surface transition-colors">
            chevron_left
          </button>
          <button className="material-symbols-outlined border border-mc-outline-variant p-2 rounded hover:bg-mc-surface transition-colors">
            chevron_right
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActiveIndex(i === activeIndex ? null : i)}
            className={`p-8 rounded-xl flex flex-col items-center gap-4 transition-all cursor-pointer group ${
              i === activeIndex
                ? "bg-black text-white"
                : "bg-mc-surface text-black hover:bg-black hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-4xl">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory;
