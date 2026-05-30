"use client";

import OrderBarChart from "@/components/shared/OrderBarChart";
import OrderPieChart from "@/components/shared/OrderPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  });

  const { data } = adminDashboardData as ApiResponse<IAdminDashboardData>;
  return (
    <div>
      <StatsCard
        title="Total Orders"
        value={data?.orderCount || 0}
        iconName="CalendarDays"
        description="Number of Orders scheduled"
      />
      <StatsCard
        title="Total customers"
        value={data?.customerCount || 0}
        iconName="Users"
        description="Number of customers registered"
      />

      <OrderBarChart data={data?.barChartData || []} />

      <OrderPieChart data={data?.pieChartData || []} />
    </div>
  );
};

export default AdminDashboardContent;
