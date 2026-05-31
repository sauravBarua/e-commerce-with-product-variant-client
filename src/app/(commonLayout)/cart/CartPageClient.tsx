"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.services";
import { getUserInfo } from "@/services/auth.services";
import { ICartItem } from "@/types/cart.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearGuestCart,
  IGuestCartItem,
  removeGuestItem,
  updateGuestItemQty,
} from "@/store/guestCartSlice";

function getPrimaryImage(item: ICartItem): string {
  const imgs = item.variant.colorGroup.images;
  return imgs.find((i) => i.isPrimary)?.url ?? imgs[0]?.url ?? "/images/placeholder.png";
}

function getVariantLabel(item: ICartItem): string {
  return item.variant.attributes.map((a) => a.value).join(" / ") || item.variant.sku || "";
}

export default function CartPageClient() {
  const dispatch = useAppDispatch();
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

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      updateCartItem(id, qty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Failed to update quantity"),
  });

  const { mutate: mutateRemove } = useMutation({
    mutationFn: (id: string) => removeCartItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Failed to remove item"),
  });

  const { mutate: mutateClear } = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: () => toast.error("Failed to clear cart"),
  });

  const isLoading = isUserLoading || (!!user && isCartLoading);
  const items = user ? authItems : guestItems;
  const subtotal = user
    ? authItems.reduce((sum, i) => sum + Number(i.variant.price) * i.quantity, 0)
    : guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12">
      <h1 className="text-2xl font-bold mb-10">Shopping Cart</h1>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-6 border-b border-[#EBEBEB]">
                <Skeleton className="w-20 h-20 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-24 h-8 rounded" />
                <Skeleton className="w-16 h-5 rounded" />
              </div>
            ))}
          </div>
          <Skeleton className="w-full lg:w-[450px] h-96 rounded-lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <ShoppingCart className="h-16 w-16 text-gray-200" />
          <p className="text-gray-500">Your cart is empty</p>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      )}

      {/* Cart content */}
      {!isLoading && items.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── Cart Items List ── */}
          <section className="flex-1">
            {user
              ? authItems.map((item: ICartItem) => {
                  const available =
                    (item.variant.inventory?.quantity ?? 0) -
                    (item.variant.inventory?.reservedQuantity ?? 0);
                  return (
                    <div
                      key={item.id}
                      className="border-b border-[#EBEBEB] py-6 flex items-center gap-4"
                    >
                      {/* Image */}
                      <Link href={`/product/${item.variant.colorGroup.product.id}`}>
                        <Image
                          src={getPrimaryImage(item)}
                          alt={item.variant.colorGroup.product.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain rounded"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.variant.colorGroup.product.id}`}>
                          <h3 className="font-medium text-base leading-snug line-clamp-2 hover:underline">
                            {item.variant.colorGroup.product.name}{" "}
                            {item.variant.colorGroup.colorValue} {getVariantLabel(item)}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">#{item.variantId}</p>
                      </div>

                      {/* Controls + price + remove */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Qty */}
                        <div className="flex items-center border border-gray-200 rounded px-2">
                          <button
                            className="px-2 py-1 text-lg disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              mutateUpdate({ id: item.id, qty: item.quantity - 1 })
                            }
                          >
                            -
                          </button>
                          <input
                            readOnly
                            type="text"
                            value={item.quantity}
                            className="w-10 text-center border-none focus:ring-0 text-sm"
                          />
                          <button
                            className="px-2 py-1 text-lg disabled:opacity-30"
                            disabled={item.quantity >= available}
                            onClick={() =>
                              mutateUpdate({ id: item.id, qty: item.quantity + 1 })
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold w-20 text-right">
                          ${(Number(item.variant.price) * item.quantity).toLocaleString()}
                        </span>

                        {/* Remove */}
                        <button
                          className="text-gray-400 hover:text-black ml-2 transition-colors"
                          onClick={() => mutateRemove(item.id)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              : guestItems.map((item: IGuestCartItem) => (
                  <div
                    key={item.variantId}
                    className="border-b border-[#EBEBEB] py-6 flex items-center gap-4"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.productId}`}>
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain rounded"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-medium text-base leading-snug line-clamp-2 hover:underline">
                          {item.productName}{" "}
                          {item.colorValue}
                          {item.variantLabel ? ` ${item.variantLabel}` : ""}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">#{item.variantId}</p>
                    </div>

                    {/* Controls + price + remove */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Qty */}
                      <div className="flex items-center border border-gray-200 rounded px-2">
                        <button
                          className="px-2 py-1 text-lg disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            dispatch(
                              updateGuestItemQty({
                                variantId: item.variantId,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          readOnly
                          type="text"
                          value={item.quantity}
                          className="w-10 text-center border-none focus:ring-0 text-sm"
                        />
                        <button
                          className="px-2 py-1 text-lg"
                          onClick={() =>
                            dispatch(
                              updateGuestItemQty({
                                variantId: item.variantId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-bold w-20 text-right">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Remove */}
                      <button
                        className="text-gray-400 hover:text-black ml-2 transition-colors"
                        onClick={() => dispatch(removeGuestItem(item.variantId))}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

            {/* Clear all (auth only) */}
            {user && authItems.length > 0 && (
              <div className="mt-4 flex justify-start">
                <button
                  className="text-sm text-gray-400 hover:text-black transition-colors"
                  onClick={() => mutateClear()}
                >
                  Clear all items
                </button>
              </div>
            )}
            {!user && guestItems.length > 0 && (
              <div className="mt-4 flex justify-start">
                <button
                  className="text-sm text-gray-400 hover:text-black transition-colors"
                  onClick={() => dispatch(clearGuestCart())}
                >
                  Clear all items
                </button>
              </div>
            )}
          </section>

          {/* ── Order Summary ── */}
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

              {/* Checkout */}
              <Link
                href="/checkout"
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Checkout
              </Link>
            </div>
          </aside>

        </div>
      )}
    </main>
  );
}
