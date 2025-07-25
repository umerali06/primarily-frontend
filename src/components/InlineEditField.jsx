import React, { useState, useEffect, useRef } from "react";
import { TbEdit, TbCheck, TbX, TbAlertCircle, TbLoader } from "react-icons/tb";

const InlineEditField = ({
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === "text" || multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, type, multiline]);

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
  };

  const handleSave = async () => {
    const validationError = validateValue(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (err) {
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
      <div
        className={`group inline-flex items-center gap-2 ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } ${className}`}
        onClick={handleEdit}
      >
        <span className={`${!value && "text-gray-400 italic"}`}>
          {formatDisplayValue(value)}
        </span>
        {!disabled && (
          <TbEdit
            size={14}
            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
    );
  }

  const renderInput = () => {
    const baseClasses = `
      border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50
      ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}
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
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !!error}
            className="p-1 text-primary hover:bg-primary-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default InlineEditField;
