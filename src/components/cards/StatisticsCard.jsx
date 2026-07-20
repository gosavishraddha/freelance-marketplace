import React from "react";
import { motion } from "framer-motion";

export const StatisticsCard = ({ title, value, change, changeType = "increase", icon: Icon, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium flex items-center justify-between ${className}`}
    >
      <div className="flex-1">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
          {title}
        </span>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
          {value}
        </h3>
        {change !== undefined && (
          <p className="text-xs">
            <span className={`font-bold mr-1 ${
              changeType === "increase" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
            }`}>
              {changeType === "increase" ? "+" : ""}{change}%
            </span>
            <span className="text-gray-400 dark:text-gray-550">vs last month</span>
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3.5 bg-primary-50 dark:bg-primary-950/20 text-primary dark:text-primary-400 rounded-2xl ml-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
};
