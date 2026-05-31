"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IProduct } from "@/types/inventory.types";
import { format } from "date-fns";
import Image from "next/image";

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return format(d, "MMM dd, yyyy HH:mm");
};

const ViewProductDialog = ({
  open,
  onOpenChange,
  product,
}: ViewProductDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] md:max-w-[calc(100vw-4rem)] lg:w-[min(88vw,52rem)] lg:max-w-[min(88vw,52rem)]">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Details for {product?.name ?? "this product"}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="px-6 py-5">
            {!product ? (
              <p className="text-sm text-muted-foreground">
                No product selected.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="rounded-lg border p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {product.name}
                  </p>
                  <p>
                    <span className="font-medium">Slug:</span>{" "}
                    {product.slug ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Brand:</span>{" "}
                    {product.brand.name}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {product.category.name}
                  </p>
                  <p>
                    <span className="font-medium">Rating:</span>{" "}
                    {Number(product.averageRating).toFixed(1)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDateTime(product.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDateTime(product.updatedAt)}
                  </p>
                  <div>
                    <p className="font-medium mb-1">Description:</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Color Groups */}
                {product.colorGroups.length > 0 && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <p className="text-sm font-medium">
                      Color Groups ({product.colorGroups.length})
                    </p>
                    {product.colorGroups.map((cg) => {
                      const primaryImage = cg.images.find(
                        (img) => img.isPrimary,
                      );
                      return (
                        <div
                          key={cg.id}
                          className="flex items-start gap-3 border-t pt-3 first:border-t-0 first:pt-0"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={cg.colorValue}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-4 w-4 rounded-full border border-gray-200 shrink-0"
                                style={{
                                  backgroundColor:
                                    cg.colorCode ?? cg.colorValue,
                                }}
                              />
                              <span className="font-medium">
                                {cg.colorValue}
                              </span>
                              {cg.colorCode && (
                                <span className="text-xs text-muted-foreground">
                                  {cg.colorCode}
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {cg.variants.length} variant
                              {cg.variants.length !== 1 ? "s" : ""}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {cg.variants.map((v) => (
                                <span
                                  key={v.id}
                                  className="rounded border px-2 py-0.5 text-xs"
                                >
                                  {v.attributes
                                    .map((a) => a.value)
                                    .join(" / ") ||
                                    v.sku ||
                                    "—"}{" "}
                                  — ${Number(v.price).toLocaleString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductDialog;
