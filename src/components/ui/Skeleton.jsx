import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-250 dark:bg-gray-800 rounded-lg ${className}`} />
  );
};
