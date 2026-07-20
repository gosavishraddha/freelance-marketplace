import React from "react";
import { motion } from "framer-motion";

export const Button = ({
  children,
  type = "button",
  variant = "primary", // primary, secondary, accent, outline, ghost, danger
  size = "md", // sm, md, lg
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary-light shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300",
    accent: "bg-accent text-white hover:bg-accent-dark focus:ring-accent-light shadow-md hover:shadow-lg",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary-50 focus:ring-primary-light",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
