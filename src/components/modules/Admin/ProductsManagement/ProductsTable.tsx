"use client";

import DataTable from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllProducts } from "@/services/product.services";
import { type PaginationMeta } from "@/types/api.types";
import { IProduct } from "@/types/inventory.types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CreateProductSheet from "./CreateProductSheet";
import { productColumns } from "./productsColumns";
import ViewProductDialog from "./ViewProductDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ProductsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { viewingItem, isViewDialogOpen, onViewOpenChange, tableActions } =
    useRowActionModalState<IProduct>({
      enableEdit: false,
      enableDelete: false,
    });

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams });

  const {
    data: productDataResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", queryString],
    queryFn: () => getAllProducts(queryString),
  });

  const products = productDataResponse?.data ?? [];
  const meta: PaginationMeta | undefined = productDataResponse?.meta;

  return (
    <>
      <DataTable
        data={products}
        columns={productColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No products found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search product by name...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={tableActions}
        toolbarAction={
          <Button size="sm" onClick={() => setIsCreateSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        }
      />

      <ViewProductDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        product={viewingItem}
      />

      <CreateProductSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
      />
    </>
  );
};

export default ProductsTable;
