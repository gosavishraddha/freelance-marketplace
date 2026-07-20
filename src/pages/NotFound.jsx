import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="bg-primary-50 dark:bg-primary-950/20 p-4 rounded-3xl mb-6">
        <HelpCircle className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">404 - Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        The workspace path you are searching for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-md shadow-primary/25"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Portal
      </Link>
    </div>
  );
};
