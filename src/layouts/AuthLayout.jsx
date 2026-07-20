import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, HelpCircle } from "lucide-react";

export const AuthLayout = () => {
  const { user } = useAuth();

  // If already logged in, redirect to respective dashboard
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col justify-between transition-colors duration-300">
      {/* Navbar Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-150/40 dark:border-gray-850/40 glass">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Gig<span className="text-primary">Sphere</span>
          </span>
        </Link>
        <Link
          to="/help"
          className="text-sm font-semibold text-gray-505 dark:text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Support
        </Link>
      </header>

      {/* Main card viewport */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-premium glass relative overflow-hidden transition-all duration-300">
          {/* Visual gradient backdrop lights */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-gray-150/40 dark:border-gray-850/40 text-xxs text-gray-450 dark:text-gray-500 font-semibold tracking-wider uppercase">
        © {new Date().getFullYear()} GigSphere Platform. Built with Premium UX.
      </footer>
    </div>
  );
};
