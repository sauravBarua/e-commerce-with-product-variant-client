"use client";

interface CustomerOrdersListProps {
  appointments: unknown[];
}

const CustomerOrdersList = ({ appointments }: CustomerOrdersListProps) => {
  return (
    <div>
      <p>Total Orders: {appointments?.length ?? 0}</p>
    </div>
  );
};

export default CustomerOrdersList;
