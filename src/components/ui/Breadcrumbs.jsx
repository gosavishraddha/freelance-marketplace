import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on main landing/auth pages if unnecessary
  if (pathnames.length === 0 || pathnames.includes("login") || pathnames.includes("register")) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-medium mb-5">
      <Link to="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-3.5 h-3.5 mr-1" />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        
        // Clean up display name
        let name = value.charAt(0).toUpperCase() + value.slice(1);
        name = name.replace(/[-_]/g, " ");
        if (name.length > 20) {
          name = name.substring(0, 18) + "...";
        }

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            {isLast ? (
              <span className="text-gray-800 dark:text-gray-200 font-semibold">{name}</span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
