import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="grow flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md w-full">
        {/* X icon */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Your payment was cancelled. Your order has not been charged. You can
          try again or return to your cart.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="px-8 py-3 border border-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
