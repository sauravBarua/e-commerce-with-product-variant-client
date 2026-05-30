import { redirect } from "next/navigation"

const CustomerDashboardPage = () => {
  redirect("/dashboard/my-orders")
}

export default CustomerDashboardPage
