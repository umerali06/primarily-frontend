import React from "react";
import FieldHelp from "./FieldHelp";
import { TbAlertCircle } from "react-icons/tb";

/**
 * Form field component with integrated contextual help
 */
const FormFieldWithHelp = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  error = null,
  helpText = null,
  showValidationGuidance = true,
  showExample = true,
  className = "",
  inputClassName = "",
  labelClassName = "",
  disabled = false,
  options = null, // For select fields
  rows = 3, // For textarea
  min = null, // For number inputs
  max = null, // For number inputs
  step = null, // For number inputs
}) => {
  // Render the appropriate input based on type
  const renderInput = () => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50
      ${
        error
          ? "border-green-300 focus:border-green-500 focus:ring-green-500"
          : "border-gray-300"
      }
      ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
      ${inputClassName}
    `;

    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      );
    }

    if (type === "select" && options) {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
        min={min}
        max={max}
        step={step}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-green-500 ml-1">*</span>}
        </label>

        <FieldHelp
          fieldName={name}
          customHelpText={helpText}
          showGuidance={showValidationGuidance}
          showExample={showExample}
          iconSize={14}
          className="ml-1"
        />
      </div>

      {renderInput()}

      {error && (
        <div
          id={`${name}-error`}
          className="flex items-center gap-1 mt-1 text-xs text-green-600"
          role="alert"
        >
          <TbAlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormFieldWithHelp;
