import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-3xl mb-6">
        <ShieldAlert className="w-12 h-12 text-red-650" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Access Denied</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        You do not have the permissions required to view this dashboard. Please verify your role credentials.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-md shadow-primary/25"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go back to Safety
      </Link>
    </div>
  );
};
