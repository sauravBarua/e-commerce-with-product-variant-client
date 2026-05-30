"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllAdmins } from "@/services/admin.services";
import { type PaginationMeta } from "@/types/api.types";
import { type IAdmin } from "@/types/admin.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ViewAdminDialog from "./ViewAdminDialog";
import { adminColumns } from "./adminsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const { viewingItem, isViewDialogOpen, onViewOpenChange, tableActions } =
    useRowActionModalState<IAdmin>({
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
    data: adminDataResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admins", queryString],
    queryFn: () => getAllAdmins(queryString),
  });

  const admins = adminDataResponse?.data ?? [];
  const meta: PaginationMeta | undefined = adminDataResponse?.meta;

  return (
    <>
      <DataTable
        data={admins}
        columns={adminColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No admins found."
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
          placeholder: "Search admin by name, email...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={tableActions}
      />

      <ViewAdminDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        admin={viewingItem}
      />
    </>
  );
};

export default AdminsTable;
