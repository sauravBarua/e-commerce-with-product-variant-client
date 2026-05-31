"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cancelOrder, getMyOrders } from "@/services/order.services";
import { IOrder, OrderStatus, PaymentStatus } from "@/types/order.types";

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  PACKED: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  RETURNED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-50 text-red-500",
};

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED"];

function OrderCard({ order }: { order: IOrder }) {
  const queryClient = useQueryClient();

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: () => cancelOrder(order.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order cancelled");
    },
    onError: () => toast.error("Failed to cancel order"),
  });

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const firstImage =
    order.orderItems[0]?.variant?.colorGroup?.images?.[0]?.url ??
    "/images/placeholder.png";

  return (
    <div className="border rounded-xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
          <p className="font-mono text-xs text-gray-700 break-all">{order.id}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}
          >
            {order.status}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <Separator />

      {/* Items preview */}
      <div className="space-y-3">
        {order.orderItems.map((item) => {
          const img =
            item.variant?.colorGroup?.images?.[0]?.url ??
            "/images/placeholder.png";
          return (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded-lg border bg-gray-50 overflow-hidden shrink-0">
                <Image
                  src={img}
                  alt={item.variant?.colorGroup?.product?.name ?? "Product"}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">
                  {item.variant?.colorGroup?.product?.name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.variant?.colorGroup?.colorValue}
                  {item.variant?.attributes?.length > 0 &&
                    " · " + item.variant.attributes.map((a) => a.value).join(" / ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × ${Number(item.priceAtOrder).toLocaleString()}
                </p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                ${(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Order Total</p>
          <p className="text-base font-bold">
            ${Number(order.totalAmount).toLocaleString()}
          </p>
        </div>
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            disabled={cancelling}
            onClick={() => cancel()}
          >
            {cancelling ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Cancelling…
              </>
            ) : (
              "Cancel Order"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

const CustomerOrdersList = () => {
  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(),
    retry: false,
  });

  const orders = ordersRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Package className="h-14 w-14 text-gray-200" />
        <p className="text-gray-500 text-sm">No orders yet</p>
        <p className="text-xs text-muted-foreground">
          Place your first order to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-semibold">
          {orders.length} Order{orders.length !== 1 ? "s" : ""}
        </h2>
      </div>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default CustomerOrdersList;

