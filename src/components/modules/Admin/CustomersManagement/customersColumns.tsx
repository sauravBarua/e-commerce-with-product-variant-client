import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { type ICustomer } from "@/types/customer.types";
import { type ColumnDef } from "@tanstack/react-table";

export const customerColumns: ColumnDef<ICustomer>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto}
      />
    ),
  },
  {
    id: "contactNumber",
    accessorKey: "contactNumber",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.contactNumber || "N/A"}</span>
    ),
  },
  {
    id: "isDeleted",
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isDeleted ? "destructive" : "default"}>
        {row.original.isDeleted ? "Deleted" : "Active"}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => (
      <DateCell
        date={row.original.createdAt ?? ""}
        formatString="MMM dd, yyyy"
      />
    ),
  },
];
