import React, { useState } from "react";
import FieldHelp from "./FieldHelp";
import ValidationGuidance from "./ValidationGuidance";
import { TbAlertCircle, TbEye, TbEyeOff } from "react-icons/tb";

/**
 * Enhanced form field component with integrated contextual help and validation guidance
 */
const EnhancedFormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  error = null,
  helpText = null,
  validationRules = [],
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
  autoFocus = false,
  showPasswordToggle = true, // For password fields
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle focus events
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Determine the actual input type for password fields
  const actualType = type === "password" && showPassword ? "text" : type;

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
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          autoFocus={autoFocus}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          autoFocus={autoFocus}
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
      <div className="relative">
        <input
          id={name}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClasses}
          min={min}
          max={max}
          step={step}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          autoFocus={autoFocus}
        />

        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex="-1"
          >
            {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
          </button>
        )}
      </div>
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
          showGuidance={false} // We'll show guidance separately
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

      {showValidationGuidance && (focused || error) && (
        <ValidationGuidance
          fieldName={name}
          value={value}
          validationRules={validationRules}
          className="mt-1"
        />
      )}
    </div>
  );
};

export default EnhancedFormField;
