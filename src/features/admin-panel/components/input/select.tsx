import React from "react";

import { cn } from "../../../../utils/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          ref={ref} // Pass the ref to the native select element
          className={cn(
            "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props} // Pass other props like name, onChange, onBlur from register
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* Map over the options array to create the <option> elements */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Conditionally render the error message */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "select";

export { Select };
