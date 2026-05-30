import CustomerOrdersList from "@/components/modules/Customer/Orders/CustomerOrdersList";
import { getMyAppointments } from "@/services/order.services";
import { redirect } from "next/navigation";

const CustomerOrdersPage = async () => {
  let response;
  try {
    response = await getMyAppointments();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect("/login");
    }
    throw error;
  }

  return <CustomerOrdersList appointments={response.data} />;
};

export default CustomerOrdersPage;
