import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { type IAdmin } from "@/types/admin.types";
import { type ColumnDef } from "@tanstack/react-table";

export const adminColumns: ColumnDef<IAdmin>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Admin",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto}
      />
    ),
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.phone || "N/A"}</span>
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
