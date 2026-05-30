import DoctorAppointmentsList from "@/components/modules/Doctor/Appointments/DoctorAppointmentsList";
import { getMyAppointments } from "@/services/order.services";
import { redirect } from "next/navigation";

const DoctorsAppointmentsPage = async () => {
  let response;
  try {
    response = await getMyAppointments();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect("/login");
    }
    throw error;
  }

  return <DoctorAppointmentsList appointments={response.data} />;
};

export default DoctorsAppointmentsPage;
