import DateCell from "@/components/shared/cell/DateCell";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/types/inventory.types";
import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const productColumns: ColumnDef<IProduct>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const primaryImage = row.original.colorGroups
        .flatMap((cg) => cg.images)
        .find((img) => img.isPrimary);

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-gray-50">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={row.original.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                N/A
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.slug ?? "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "brand",
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.brand.name}</span>
    ),
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category.name}</span>
    ),
  },
  {
    id: "colors",
    header: "Colors",
    cell: ({ row }) => (
      <div className="flex gap-1.5 flex-wrap">
        {row.original.colorGroups.map((cg) => (
          <span
            key={cg.id}
            title={cg.colorValue}
            className="h-5 w-5 rounded-full border border-gray-200 shrink-0"
            style={{ backgroundColor: cg.colorCode ?? cg.colorValue }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const count = row.original.colorGroups.reduce(
        (sum, cg) => sum + cg.variants.length,
        0,
      );
      return <span className="text-sm">{count}</span>;
    },
  },
  {
    id: "averageRating",
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="text-sm">
        {Number(row.original.averageRating).toFixed(1)}
      </span>
    ),
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];
