"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getMyCart } from "@/services/cart.services";
import { getUserInfo } from "@/services/auth.services";
import {
  getMyAddresses,
  createAddress,
  ICreateAddressPayload,
} from "@/services/address.services";
import { placeOrderAction } from "./_action";
import { createPaymentSession } from "@/services/payment.services";
import { ICartItem } from "@/types/cart.types";
import { IAddress } from "@/types/order.types";
import { useAppSelector } from "@/store/hooks";
import { IGuestCartItem } from "@/store/guestCartSlice";

function getPrimaryImage(item: ICartItem): string {
  const imgs = item.variant.colorGroup.images;
  return imgs.find((i) => i.isPrimary)?.url ?? imgs[0]?.url ?? "/images/placeholder.png";
}

const emptyAddr: ICreateAddressPayload = {
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-between mb-16 max-w-3xl mx-auto">
      {/* Step 1: Address */}
      <div className={`flex items-center space-x-3 ${step === 1 ? "opacity-100" : "opacity-40"}`}>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 1 ? "bg-black text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Step 1</p>
          <p className="text-sm font-bold">Address</p>
        </div>
      </div>
      <div className="flex-1 h-px bg-gray-200 mx-4" />
      {/* Step 2: Shipping (always dimmed) */}
      <div className="flex items-center space-x-3 opacity-40">
        <div className="bg-gray-100 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Step 2</p>
          <p className="text-sm font-bold">Shipping</p>
        </div>
      </div>
      <div className="flex-1 h-px bg-gray-200 mx-4" />
      {/* Step 3: Payment */}
      <div className={`flex items-center space-x-3 ${step === 2 ? "opacity-100" : "opacity-40"}`}>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 2 ? "bg-black text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Step 3</p>
          <p className="text-sm font-bold">Payment</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<ICreateAddressPayload>(emptyAddr);

  // -- Queries ------------------------------------------------
  const { data: userRes, isLoading: isUserLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUserInfo(),
    retry: false,
    staleTime: Infinity,
  });
  const user = userRes ?? null;
  console.log("[checkout] isUserLoading:", isUserLoading, "user:", user);

  const guestItems = useAppSelector((s) => s.guestCart.items);

  const { data: cartRes, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getMyCart(),
    retry: false,
    enabled: !!user,
  });

  const { data: addressRes, isLoading: isAddrLoading } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: () => getMyAddresses(),
    retry: false,
    enabled: !!user,
  });

  const authItems = cartRes?.data?.items ?? [];
  const displayItems = user ? authItems : guestItems;
  const addresses: IAddress[] = addressRes?.data ?? [];

  const subtotal = user
    ? authItems.reduce((sum, i) => sum + Number(i.variant.price) * i.quantity, 0)
    : guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // -- Mutations ----------------------------------------------
  const { mutate: addAddress, isPending: isAddingAddress } = useMutation({
    mutationFn: () => createAddress(newAddr),
    onSuccess: (res) => {
      if (!res?.success) {
        toast.error("Failed to add address");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      toast.success("Address added!");
      setShowAddForm(false);
      setNewAddr(emptyAddr);
      if (res.data) setSelectedAddressId(res.data.id);
    },
    onError: () => toast.error("Failed to add address"),
  });

  const { mutate: placeOrder, isPending: isPlacingOrder } = useMutation({
    mutationFn: async () => {
      // Step 1: Create the order
      const orderRes = await placeOrderAction({
        items: authItems.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        addressId: selectedAddressId ?? undefined,
      });
      if (!orderRes?.success || !orderRes.data) {
        throw new Error(orderRes?.message ?? "Failed to create order");
      }
      // Step 2: Create Stripe checkout session
      const paymentRes = await createPaymentSession(orderRes.data.id);
      if (!paymentRes?.success || !paymentRes.data?.checkoutUrl) {
        throw new Error("Failed to create payment session");
      }
      return paymentRes.data.checkoutUrl;
    },
    onSuccess: (checkoutUrl) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      window.location.href = checkoutUrl;
    },
    onError: (error: Error) => toast.error(error.message || "Failed to place order — please try again"),
  });

  // -- Global loading -----------------------------------------
  if (isUserLoading || isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // -- Empty cart ---------------------------------------------
  if (displayItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-200" />
        <p className="text-gray-500">Your cart is empty.</p>
        <Link
          href="/"
          className="px-6 py-2 border border-black rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // -- Step 1: Address Selection ------------------------------
  if (step === 1) {
    return (
      <main className="grow max-w-5xl mx-auto px-4 py-12 w-full">
        <Stepper step={step} />

        <section className="space-y-6">
          <h2 className="text-xl font-bold mb-8">Select Address</h2>

          {!user ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6">Please log in to select a delivery address.</p>
              <Link
                href="/login?redirect=/checkout"
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Login to Continue
              </Link>
            </div>
          ) : isAddrLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {/* Address cards */}
              <div className="space-y-4">
                {addresses.length === 0 && !showAddForm && (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No saved addresses. Add one below.
                  </p>
                )}
                {addresses.map((addr) => (
                  <label key={addr.id} className="relative block group cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="sr-only peer"
                    />
                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-transparent peer-checked:border-black transition-all hover:border-black">
                      <div className="flex items-start space-x-4">
                        <div
                          className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            borderColor: selectedAddressId === addr.id ? "black" : "#d1d5db",
                          }}
                        >
                          {selectedAddressId === addr.id && (
                            <div className="w-2.5 h-2.5 bg-black rounded-full" />
                          )}
                        </div>
                        <div className="text-sm leading-relaxed">
                          <p className="font-semibold text-base text-black mb-1">{addr.street}</p>
                          <p className="text-gray-600">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                          <p className="text-gray-600">{addr.country}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add New Address dashed button */}
              <div className="relative py-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200 border-dashed" />
                </div>
                <div className="relative flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAddForm((v) => !v)}
                    className="flex flex-col items-center space-y-2 bg-white px-4"
                  >
                    <span className="bg-black text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 4v16m8-8H4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        />
                      </svg>
                    </span>
                    <span className="text-xs font-medium text-black">Add New Address</span>
                  </button>
                </div>
              </div>

              {/* Inline add-address form */}
              {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-sm">New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Street address"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr((p) => ({ ...p, street: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr((p) => ({ ...p, state: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr((p) => ({ ...p, postalCode: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={newAddr.country}
                      onChange={(e) => setNewAddr((p) => ({ ...p, country: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewAddr(emptyAddr);
                      }}
                      className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={
                        isAddingAddress ||
                        !newAddr.street ||
                        !newAddr.city ||
                        !newAddr.state ||
                        !newAddr.postalCode ||
                        !newAddr.country
                      }
                      onClick={() => addAddress()}
                      className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingAddress ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save Address"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-12">
          <Link
            href="/cart"
            className="px-12 py-4 border border-black rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
          >
            Back
          </Link>
          <button
            type="button"
            disabled={!user || !selectedAddressId}
            onClick={() => setStep(2)}
            className="px-12 py-4 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </main>
    );
  }

  // -- Step 2: Payment ----------------------------------------
  return (
    <main className="grow max-w-5xl mx-auto px-4 py-12 w-full">
      <Stepper step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-8">Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-8">
              {user
                ? authItems.map((item: ICartItem) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
                        <Image
                          src={getPrimaryImage(item)}
                          alt={item.variant.colorGroup.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="grow min-w-0">
                        <h3 className="font-medium text-sm leading-snug line-clamp-2">
                          {item.variant.colorGroup.product.name}{" "}
                          {item.variant.colorGroup.colorValue}{" "}
                          {item.variant.attributes.map((a) => a.value).join(" / ")}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm shrink-0">
                        ${(Number(item.variant.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                : guestItems.map((item: IGuestCartItem) => (
                    <div
                      key={item.variantId}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="grow min-w-0">
                        <h3 className="font-medium text-sm leading-snug line-clamp-2">
                          {item.productName} {item.colorValue}
                          {item.variantLabel ? ` ${item.variantLabel}` : ""}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm shrink-0">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
            </div>

            {/* Address + Shipment */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              {selectedAddress && (
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                    Address
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.postalCode}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                  Shipment method
                </p>
                <p className="text-sm text-gray-700">Free</p>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="mt-8 space-y-3">
              <div className="flex justify-between">
                <span className="font-bold">Subtotal</span>
                <span className="font-bold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Estimated Tax</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Estimated shipping &amp; Handling</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <h2 className="text-xl font-bold mb-8">Payment</h2>

          {/* Stripe card payment */}
          <div className="border-2 border-black rounded-2xl p-6 mb-10 flex items-center gap-4">
            <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
            </div>
            <div className="grow">
              <p className="font-semibold">Credit / Debit Card</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Securely pay with Visa, Mastercard, or American Express via Stripe.
              </p>
            </div>
            {/* Stripe wordmark */}
            <svg
              className="w-12 h-6 shrink-0"
              viewBox="0 0 60 25"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Stripe"
            >
              <path
                fill="#635BFF"
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.23c0-1.85-1.28-2.58-2.06-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.87zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 2.96-1.7 3.51-1.7v3.86c-.49-.09-2.08-.38-3.21.27zm-8.54 4.56c0 2.53 3.78 1.68 3.78 5.52 0 3.26-2.35 4.7-5.94 4.7A9.86 9.86 0 0 1 9 23.26v-3.46c1.28.68 2.9 1.23 4.22 1.23.86 0 1.48-.25 1.48-.93 0-2.67-3.78-1.74-3.78-5.57 0-3.15 2.35-4.62 5.8-4.62 1.35 0 2.7.3 3.93.9v3.4c-1.19-.6-2.7-1.09-3.93-1.09-.78 0-1.34.22-1.34.85zm-9.58 4.56c0 .85.42 1.17 1.16 1.17.42 0 .84-.08 1.22-.22v3.1a7.37 7.37 0 0 1-2.6.46c-2.46 0-3.9-1.23-3.9-3.9V8.62H0V5.57h1.68V2.22l4.12-.88v4.23h2.38v3.05H5.8v6.87z"
              />
            </svg>
          </div>

          {/* Back / Place Order */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-4 border border-black rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isPlacingOrder || (!!user && authItems.length === 0)}
              onClick={() => placeOrder()}
              className="flex-1 py-4 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to payment…
                </>
              ) : (
                "Pay with Stripe"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

