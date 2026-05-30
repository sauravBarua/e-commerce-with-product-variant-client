"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllCustomers } from "@/services/customer.services";
import { type PaginationMeta } from "@/types/api.types";
import { type ICustomer } from "@/types/customer.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ViewCustomerDialog from "./ViewCustomerDialog";
import { customerColumns } from "./customersColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const CustomersTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const { viewingItem, isViewDialogOpen, onViewOpenChange, tableActions } =
    useRowActionModalState<ICustomer>({
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
    data: customerDataResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["customers", queryString],
    queryFn: () => getAllCustomers(queryString),
  });

  const customers = customerDataResponse?.data ?? [];
  const meta: PaginationMeta | undefined = customerDataResponse?.meta;

  return (
    <>
      <DataTable
        data={customers}
        columns={customerColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No customers found."
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
          placeholder: "Search customer by name, email...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={tableActions}
      />

      <ViewCustomerDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        customer={viewingItem}
      />
    </>
  );
};

export default CustomersTable;
