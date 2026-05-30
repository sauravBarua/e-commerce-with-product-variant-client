import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      // title : "Dashboard",
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const doctorNavItems: NavSection[] = [
  {
    title: " Patient Management",
    items: [
      {
        title: "Appointments",
        href: "/doctor/dashboard/appointments",
        icon: "Calender",
      },
      {
        title: "My Schedules",
        href: "/doctor/dashboard/my-schedules",
        icon: "Clock",
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
      },
      {
        title: "Customers",
        href: "/admin/dashboard/customers-management",
        icon: "Users",
      },
    ],
  },
  {
    title: "E-Commerce Management",
    items: [
      {
        title: "Products",
        href: "/admin/dashboard/products-management",
        icon: "Box",
      },
       {
        title: "Inventory",
        href: "/admin/dashboard/inventory-management",

        icon: "CalendarClock",
      },
      {
        title: "Brands",
        href: "/admin/dashboard/brands-management",
        icon: "Clock",
      },
      {
        title: "Categories",
        href: "/admin/dashboard/categories-management",
        icon: "Hospital",
      },
      {
        title: "Orders",
        href: "/admin/dashboard/orders-management",

        icon: "CalendarClock",
      },
      {
        title: "Customer Reviews",
        href: "/admin/dashboard/customer-reviews-management",
        icon: "Star",
      },
    ],
  },
];

export const customerNavItems: NavSection[] = [
  {
    title: "Appointments",
    items: [
      {
        title: "My Orders",
        href: "/dashboard/my-orders",
        icon: "Calendar",
      },
      {
        title: "My Reviews",
        href: "/dashboard/my-reviews",
        icon: "Star",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "ADMIN":
      return [...commonNavItems, ...doctorNavItems];

    case "CUSTOMER":
      return [...commonNavItems, ...customerNavItems];
  }
};
