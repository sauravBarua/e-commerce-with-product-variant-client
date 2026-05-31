"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyCart } from "@/services/cart.services";
import { getUserInfo } from "@/services/auth.services";
import { placeOrderAction } from "./_action";
import { ICartItem } from "@/types/cart.types";
import { useAppSelector } from "@/store/hooks";
import { IGuestCartItem } from "@/store/guestCartSlice";

function getPrimaryImage(item: ICartItem): string {
  const imgs = item.variant.colorGroup.images;
  return imgs.find((i) => i.isPrimary)?.url ?? imgs[0]?.url ?? "/images/placeholder.png";
}

export default function CheckoutClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userRes, isLoading: isUserLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUserInfo(),
    retry: false,
    staleTime: Infinity,
  });
  const user = userRes ?? null;

  const guestItems = useAppSelector((s) => s.guestCart.items);

  const { data: cartRes, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getMyCart(),
    retry: false,
    enabled: !!user,
  });

  const authItems = cartRes?.data?.items ?? [];
  const displayItems = user ? authItems : guestItems;

  const subtotal = user
    ? authItems.reduce((sum, i) => sum + Number(i.variant.price) * i.quantity, 0)
    : guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: () =>
      placeOrderAction({
        items: authItems.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      }),
    onSuccess: (res) => {
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to place order");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order placed successfully!");
      router.push("/dashboard/my-orders");
    },
    onError: () => toast.error("Failed to place order — please try again"),
  });

  if (isUserLoading || isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-200" />
        <p className="text-gray-500">Your cart is empty.</p>
        <Button variant="outline" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12">
      <h1 className="text-2xl font-bold mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-16">

        {/* ── Left: items list ── */}
        <section className="flex-1">
          {user
            ? authItems.map((item: ICartItem) => (
                <div
                  key={item.id}
                  className="py-6 flex items-center gap-4"
                  style={{ borderBottom: "1px solid #EBEBEB" }}
                >
                  <Image
                    src={getPrimaryImage(item)}
                    alt={item.variant.colorGroup.product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base leading-snug line-clamp-2">
                      {item.variant.colorGroup.product.name}{" "}
                      {item.variant.colorGroup.colorValue}{" "}
                      {item.variant.attributes.map((a) => a.value).join(" / ")}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">#{item.variantId}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold w-20 text-right">
                      ${(Number(item.variant.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            : guestItems.map((item: IGuestCartItem) => (
                <div
                  key={item.variantId}
                  className="py-6 flex items-center gap-4"
                  style={{ borderBottom: "1px solid #EBEBEB" }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base leading-snug line-clamp-2">
                      {item.productName}{" "}
                      {item.colorValue}
                      {item.variantLabel ? ` ${item.variantLabel}` : ""}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">#{item.variantId}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold w-20 text-right">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
        </section>

        {/* ── Right: order summary card ── */}
        <aside className="w-full lg:w-[450px]">
          <div
            className="p-10 flex flex-col gap-8"
            style={{ border: "1px solid #EBEBEB", borderRadius: 8 }}
          >
            <h2 className="text-xl font-bold">Order Summary</h2>

            {/* Price breakdown */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-base">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Estimated Tax</span>
                <span className="font-medium text-black">—</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Estimated shipping &amp; Handling</span>
                <span className="font-medium text-black">Free</span>
              </div>
              <div className="flex justify-between items-center text-base mt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place order / Login */}
            {user ? (
              <button
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isPending || authItems.length === 0}
                onClick={() => placeOrder()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing order…
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            ) : (
              <Link
                href="/login?redirect=/checkout"
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Login to Place Order
              </Link>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}
