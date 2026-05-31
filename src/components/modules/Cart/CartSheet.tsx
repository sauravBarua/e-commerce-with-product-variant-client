"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCartItemImage(item: ICartItem): string {
  const imgs = item.variant.colorGroup.images;
  const primary = imgs.find((i) => i.isPrimary);
  return primary?.url ?? imgs[0]?.url ?? "/images/placeholder.png";
}

function getCartItemLabel(item: ICartItem): string {
  return (
    item.variant.attributes.map((a) => a.value).join(" / ") ||
    item.variant.sku ||
    "Default"
  );
}

// ── Guest Cart ────────────────────────────────────────────────────────────────

function GuestCartContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.guestCart.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      <SheetHeader className="px-5 py-4 border-b flex flex-row items-center justify-between shrink-0">
        <SheetTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {totalItems > 0 && (
            <span className="ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
              {totalItems}
            </span>
          )}
        </SheetTitle>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-7 px-2"
            onClick={() => dispatch(clearGuestCart())}
          >
            Clear all
          </Button>
        )}
      </SheetHeader>

      <ScrollArea className="flex-1 px-5">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              asChild
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-4 py-5">
            {items.map((item: IGuestCartItem) => (
              <div key={item.variantId} className="flex gap-3">
                <Link
                  href={`/product/${item.productId}`}
                  onClick={() => onOpenChange(false)}
                  className="shrink-0"
                >
                  <div className="relative h-20 w-20 rounded-lg border bg-gray-50 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productId}`}
                    onClick={() => onOpenChange(false)}
                  >
                    <p className="text-sm font-medium leading-snug line-clamp-1 hover:underline">
                      {item.productName}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.colorValue}
                    {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(
                            updateGuestItemQty({
                              variantId: item.variantId,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          dispatch(
                            updateGuestItemQty({
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => dispatch(removeGuestItem(item.variantId))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {items.length > 0 && (
        <div className="border-t px-5 py-4 space-y-3 shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${subtotal.toLocaleString()}</span>
          </div>
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            asChild
            onClick={() => onOpenChange(false)}
          >
            <Link href="/cart">View Cart &amp; Checkout</Link>
          </Button>
        </div>
      )}
    </>
  );
}

// ── Auth Cart ─────────────────────────────────────────────────────────────────

function AuthCartContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const { data: cartRes, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getMyCart(),
    retry: false,
  });

  const items = cartRes?.data?.items ?? [];
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.variant.price) * i.quantity,
    0,
  );

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

  const { mutate: mutateClear, isPending: isClearing } = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: () => toast.error("Failed to clear cart"),
  });

  return (
    <>
      <SheetHeader className="px-5 py-4 border-b flex flex-row items-center justify-between shrink-0">
        <SheetTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {totalItems > 0 && (
            <span className="ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
              {totalItems}
            </span>
          )}
        </SheetTitle>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-7 px-2"
            onClick={() => mutateClear()}
            disabled={isClearing}
          >
            Clear all
          </Button>
        )}
      </SheetHeader>

      <ScrollArea className="flex-1 px-5">
        {isLoading && (
          <div className="space-y-4 py-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              asChild
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="space-y-4 py-5">
            {items.map((item: ICartItem) => {
              const available =
                (item.variant.inventory?.quantity ?? 0) -
                (item.variant.inventory?.reservedQuantity ?? 0);
              const itemTotal = Number(item.variant.price) * item.quantity;

              return (
                <div key={item.id} className="flex gap-3">
                  <Link
                    href={`/product/${item.variant.colorGroup.product.id}`}
                    onClick={() => onOpenChange(false)}
                    className="shrink-0"
                  >
                    <div className="relative h-20 w-20 rounded-lg border bg-gray-50 overflow-hidden">
                      <Image
                        src={getCartItemImage(item)}
                        alt={item.variant.colorGroup.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.variant.colorGroup.product.id}`}
                      onClick={() => onOpenChange(false)}
                    >
                      <p className="text-sm font-medium leading-snug line-clamp-1 hover:underline">
                        {item.variant.colorGroup.product.name}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.variant.colorGroup.colorValue} ·{" "}
                      {getCartItemLabel(item)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            mutateUpdate({ id: item.id, qty: item.quantity - 1 })
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          disabled={item.quantity >= available}
                          onClick={() =>
                            mutateUpdate({ id: item.id, qty: item.quantity + 1 })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          ${itemTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => mutateRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {items.length > 0 && (
        <div className="border-t px-5 py-4 space-y-3 shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${subtotal.toLocaleString()}</span>
          </div>
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            asChild
            onClick={() => onOpenChange(false)}
          >
            <Link href="/cart">View Cart &amp; Checkout</Link>
          </Button>
        </div>
      )}
    </>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { data: userRes } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUserInfo(),
    retry: false,
    staleTime: Infinity,
  });
  const user = userRes ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0"
      >
        {user ? (
          <AuthCartContent onOpenChange={onOpenChange} />
        ) : (
          <GuestCartContent onOpenChange={onOpenChange} />
        )}
      </SheetContent>
    </Sheet>
  );
}

