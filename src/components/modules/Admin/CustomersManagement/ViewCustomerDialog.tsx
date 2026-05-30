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
import { type ICustomer } from "@/types/customer.types";
import { format } from "date-fns";

interface ViewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return format(d, "MMM dd, yyyy HH:mm");
};

const ViewCustomerDialog = ({
  open,
  onOpenChange,
  customer,
}: ViewCustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] md:max-w-[calc(100vw-4rem)] lg:w-[min(88vw,40rem)] lg:max-w-[min(88vw,40rem)]">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Profile information for {customer?.name ?? "this customer"}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="px-6 py-5">
            {!customer ? (
              <p className="text-sm text-muted-foreground">
                No customer selected.
              </p>
            ) : (
              <div className="rounded-lg border p-4">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {customer.contactNumber || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge
                      variant={customer.isDeleted ? "destructive" : "default"}
                    >
                      {customer.isDeleted ? "Deleted" : "Active"}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-medium">Joined:</span>{" "}
                    {formatDateTime(customer.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDateTime(customer.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerDialog;
