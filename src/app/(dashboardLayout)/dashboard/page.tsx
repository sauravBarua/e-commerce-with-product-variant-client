import { redirect } from "next/navigation"

const PatientDashboardPage = () => {
  redirect("/dashboard/my-orders")
}

export default PatientDashboardPage
