import React from "react";

export const Input = React.forwardRef(({
  label,
  error,
  type = "text",
  placeholder = "",
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export const Textarea = React.forwardRef(({
  label,
  error,
  placeholder = "",
  rows = 4,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
        }`}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Select.displayName = "Select";
