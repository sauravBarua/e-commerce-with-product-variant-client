import CustomerOrdersList from "@/components/modules/Customer/Orders/CustomerOrdersList";

export const metadata = { title: "My Orders" };

const MyOrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">My Orders</h1>
      <CustomerOrdersList />
    </div>
  );
};

export default MyOrdersPage;
