export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /admin/dashboard
    exact : []
}

// export const superAdminProtectedRoutes : RouteConfig = {
//     pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /super-admin/dashboard
//     exact : []
// }

export const customerProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
    exact : [ "/payment/success"]
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "COMMON" | null => {


    // if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    //     return "SUPER_ADMIN";
    // }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, customerProtectedRoutes)) {
        return "CUSTOMER";
    }

    

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "CUSTOMER") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    role = unifySuperAdminAndAdminRole;

    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if(routeOwner === role){
        return true;
    }

    return false;
}