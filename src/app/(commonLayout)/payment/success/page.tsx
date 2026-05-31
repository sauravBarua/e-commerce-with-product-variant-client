"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { verifyAndFinalizePayment } from "./_action";

export default function PaymentSuccessPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;
    verifyAndFinalizePayment(sessionId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="grow flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md w-full">
        {/* Checkmark icon */}
        <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Successful</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Your order has been placed and your payment was confirmed. You will
          receive an invoice by email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/my-orders"
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
