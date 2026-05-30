"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_REVIEWS = [
  {
    id: "1",
    name: "Grace Carey",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZCmARgzHqOO1DZ55gf6Ss-88obZBVqz7p78n5Q0fbvDd8FG3AELGB_nVbF1umSA33xvdOKC6vKFdB_y9CQdY3KNYsYUSSFSFXsbqwJeie_7KQfcZy7g4wTQKtTqSYnJ8Gzqfk8yz23aUd7BmaUVL_Kq4myxYILrwyj6gxJ4ngLud6SXroad1wymc_2BbNrcpOVCKxb_BOupC5tlROtQJOFslw6cu4O7966nVWQAZ1nWbZQcnTiBdy0ORUton-JRBmW7Qsfxp4E08d",
    rating: 4,
    date: "24 January, 2023",
    text: "The camera performance is absolutely stunning — even in low light conditions, photos come out crisp and vibrant. Battery life has also been a pleasant surprise, easily lasting through a full day of heavy use.",
    images: [] as string[],
  },
  {
    id: "2",
    name: "Ronald Richards",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDLRXit-u6EkWcaiePNSLYBT6-rm2TwwDgfgQRfNGc75N_alrh-OTO30QPJq725S0boi-DUzbrvf1ndGbQMyG1j4oi_qDoa1rgYEY2yVmx7qlTHGPtD0c6MZJ3Ug-JlTk6GTYnKPrD-mS5TlP5UnBVpHPMHgyjPRsAKW-IEq0RS7m_CPxkXCFl7djfDCrwD9WsU860CjJnLJmq1lpDsnnL53IF5z2ncU10G0Xseu24dEP5DBoCZTEk6nv12EFGG3mjlylnuAiZXpCU",
    rating: 5,
    date: "24 January, 2023",
    text: "Best smartphone I have ever owned. The Dynamic Island feature is surprisingly useful once you get used to it. Display quality is second to none with the always-on feature being a great addition.",
    images: [] as string[],
  },
  {
    id: "3",
    name: "Darcy King",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd0QrP7x8cnBDi1bLtteXZDuSgcL8QugblRR-UMCuAf44S_49Qz5l6ZlRQBpqvYNGLogW-yCdALXTAHO4yIiDsRYvId4pNc0A8tvwDqLXsUs_ssNvxdamc4ZO3yL49yroeyxlZMUpEfbXywFvOr28acFv5VrUJCU5jLEEs4bN0DcZKjdXEKS8yUXOnOjJvBt_prhuigs6QEQDqHjW4UlItIiYT26AguJo3S4_OiQkFW8fzefE-rpBEAwe3X1YYOGAymgxrj-ni6jJ6",
    rating: 4,
    date: "24 January, 2023",
    text: "Absolutely love this phone. The build quality feels premium and the titanium frame is noticeably lighter than previous Pro Max models.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHt48JldryW9LGN-LZClk8fD5NU-BI0aUM6h-mE0sLYH-07Dcd70QtBvMh4_3TIYrmllXe1Xk-rZFq3F5DGveSENBlWLfVunWC6WHZJ7UJTa1tf_R2cf4iDybYeW9UOlctx0HGKTGizc6CgeB2Zdhusdj0e6Yz5szqlnsmoZjEfaksXubM1j-pK8nxV1bRygum0IRnjAzjhL9UGMlbh8CnxUE28rHNnHZMHzVOLRo6rQA_yEqrh6kNrSDFIlPwC5zCclIM6Vd7L66E",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHt48JldryW9LGN-LZClk8fD5NU-BI0aUM6h-mE0sLYH-07Dcd70QtBvMh4_3TIYrmllXe1Xk-rZFq3F5DGveSENBlWLfVunWC6WHZJ7UJTa1tf_R2cf4iDybYeW9UOlctx0HGKTGizc6CgeB2Zdhusdj0e6Yz5szqlnsmoZjEfaksXubM1j-pK8nxV1bRygum0IRnjAzjhL9UGMlbh8CnxUE28rHNnHZMHzVOLRo6rQA_yEqrh6kNrSDFIlPwC5zCclIM6Vd7L66E",
    ],
  },
];

const RATING_BREAKDOWN = [
  { label: "Excellent", count: 100, pct: 80 },
  { label: "Good", count: 11, pct: 40 },
  { label: "Average", count: 3, pct: 15 },
  { label: "Below Average", count: 8, pct: 25 },
  { label: "Poor", count: 1, pct: 5 },
];

interface Props {
  averageRating: number | null;
}

export default function ProductReviews({ averageRating }: Props) {
  const [comment, setComment] = useState("");

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-bold mb-10">Reviews</h2>

      {/* Rating Summary + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Summary Box */}
        <div className="bg-mc-surface-low p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="text-6xl font-bold mb-2">
            {averageRating != null ? Number(averageRating).toFixed(1) : "—"}
          </div>
          <p className="text-mc-secondary-text text-sm mb-4">
            of {MOCK_REVIEWS.length * 40} reviews
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(Number(averageRating ?? 0))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="lg:col-span-2 space-y-4 justify-center flex flex-col">
          {RATING_BREAKDOWN.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <span className="w-28 text-sm font-medium shrink-0">
                {row.label}
              </span>
              <div className="grow bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-8 text-sm text-right text-mc-secondary-text font-medium shrink-0">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-10">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full bg-transparent border border-mc-outline-variant rounded-lg py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
        />
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-mc-surface-low p-6 rounded-2xl flex gap-4"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="grow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-sm">{review.name}</h4>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-mc-secondary-text shrink-0">
                  {review.date}
                </span>
              </div>

              <p className="text-sm text-mc-secondary-text leading-relaxed mb-4">
                {review.text}
              </p>

              {review.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {review.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-mc-outline-variant"
                    >
                      <Image
                        src={src}
                        alt={`Review image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-10 text-center">
        <button className="inline-flex items-center px-8 py-3 border border-mc-outline-variant rounded-lg text-sm font-medium hover:bg-mc-surface-low transition-all gap-2">
          Load more reviews
        </button>
      </div>
    </section>
  );
}
