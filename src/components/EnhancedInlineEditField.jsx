import React, { useState, useEffect, useRef } from "react";
import {
  TbEdit,
  TbCheck,
  TbX,
  TbAlertCircle,
  TbLoader,
  TbRefresh,
  TbInfoCircle,
} from "react-icons/tb";

/**
 * Enhanced inline edit field component with improved loading states,
 * optimistic updates, and better error handling
 */
const EnhancedInlineEditField = ({
  value,
  onSave,
  onCancel,
  type = "text",
  placeholder = "",
  validation = null,
  multiline = false,
  options = null, // For select fields
  label = "",
  required = false,
  disabled = false,
  className = "",
  displayFormatter = null, // Function to format display value
  helpText = "", // Help text for the field
  optimistic = true, // Whether to use optimistic updates
  showSuccessIndicator = true, // Whether to show success indicator
  successDuration = 1500, // Duration to show success indicator in ms
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [displayValue, setDisplayValue] = useState(value || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef(null);
  const successTimeoutRef = useRef(null);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value || "");
    setDisplayValue(value || "");
  }, [value]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === "text" || multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, type, multiline]);

  // Clean up success timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const validateValue = (val) => {
    if (required && (!val || val.toString().trim() === "")) {
      return "This field is required";
    }

    if (validation) {
      return validation(val);
    }

    return "";
  };

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setError("");
    setIsSuccess(false);
  };

  const handleSave = async () => {
    const validationError = validateValue(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    // If optimistic updates are enabled, update the display value immediately
    if (optimistic) {
      setDisplayValue(editValue);
      setIsEditing(false);
    }

    try {
      await onSave(editValue);

      // If not using optimistic updates, update display value after successful save
      if (!optimistic) {
        setDisplayValue(editValue);
        setIsEditing(false);
      }

      // Show success indicator
      if (showSuccessIndicator) {
        setIsSuccess(true);

        // Clear success indicator after duration
        successTimeoutRef.current = setTimeout(() => {
          setIsSuccess(false);
        }, successDuration);
      }
    } catch (err) {
      // If optimistic update was used, revert to original value on error
      if (optimistic) {
        setDisplayValue(value || "");
        setIsEditing(true);
      }

      setError(err.message || "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setError("");
    setIsEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleRetry = () => {
    setError("");
    handleSave();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setEditValue(newValue);

    // Real-time validation
    if (error) {
      const validationError = validateValue(newValue);
      setError(validationError);
    }
  };

  const formatDisplayValue = (val) => {
    if (displayFormatter) {
      return displayFormatter(val);
    }
    return val || placeholder || "Click to edit";
  };

  if (!isEditing) {
    return (
      <div className={`${className}`}>
        <div
          className={`group inline-flex items-center gap-2 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onClick={handleEdit}
        >
          <span
            className={`${!displayValue && "text-gray-400 italic"} ${
              isSuccess ? "text-primary" : ""
            }`}
          >
            {formatDisplayValue(displayValue)}
          </span>

          {isSuccess && showSuccessIndicator && (
            <TbCheck size={14} className="text-primary animate-pulse" />
          )}

          {!disabled && !isSuccess && (
            <TbEdit
              size={14}
              className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}

          {helpText && (
            <div className="relative inline-block">
              <TbInfoCircle
                size={14}
                className="text-gray-400 cursor-help"
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
              />
              {showHelp && (
                <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                  {helpText}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderInput = () => {
    const baseClasses = `
      border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50
      ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}
      ${isLoading ? "bg-gray-50" : ""}
      transition-all duration-200
    `;

    if (type === "select" && options) {
      return (
        <select
          ref={inputRef}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={baseClasses}
          disabled={isLoading}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
          rows={3}
          disabled={isLoading}
        />
      );
    }

    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={baseClasses}
        disabled={isLoading}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
      />
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label}
          {required && <span className="text-green-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          {renderInput()}
          {error && (
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TbAlertCircle size={12} />
              <span>{error}</span>
              <button
                type="button"
                onClick={handleRetry}
                className="ml-1 text-primary hover:underline"
              >
                <TbRefresh size={12} />
                <span className="ml-1">Retry</span>
              </button>
            </div>
          )}

          {helpText && !error && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <TbInfoCircle size={12} />
              <span>{helpText}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !!error}
            className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isLoading
                ? "bg-primary-light text-primary"
                : "text-primary hover:bg-primary-light"
            }`}
            title="Save (Enter)"
          >
            {isLoading ? (
              <TbLoader size={14} className="animate-spin" />
            ) : (
              <TbCheck size={14} />
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
            title="Cancel (Esc)"
          >
            <TbX size={14} />
          </button>
        </div>
      </div>

      {multiline && (
        <div className="text-xs text-gray-500">
          Press Ctrl+Enter to save, Esc to cancel
        </div>
      )}
    </div>
  );
};

export default EnhancedInlineEditField;
