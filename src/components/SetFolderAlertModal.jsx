import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useFolders from "../hooks/useFolders";
import {
  TbBell,
  TbMail,
  TbPhone,
  TbAlertTriangle,
  TbCheck,
} from "react-icons/tb";
import toast from "react-hot-toast";

const SetFolderAlertModal = ({ open, onClose, folder, onSave }) => {
  const [alertType, setAlertType] = useState("low_stock");
  const [alertName, setAlertName] = useState("");
  const [condition, setCondition] = useState({
    threshold: 5,
    operator: "less_than",
    field: "quantity",
  });
  const [recipients, setRecipients] = useState([""]);
  const [notificationMethods, setNotificationMethods] = useState(["email"]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingAlerts, setExistingAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const { setFolderAlert, getFolderAlerts } = useFolders();

  const alertTypes = [
    {
      value: "low_stock",
      label: "Low Stock Alert",
      description: "Alert when item quantity falls below threshold",
      icon: <TbAlertTriangle className="text-orange-500" />,
    },
    {
      value: "high_value",
      label: "High Value Alert",
      description: "Alert when folder value exceeds threshold",
      icon: <TbBell className="text-primary" />,
    },
    {
      value: "item_added",
      label: "Item Added",
      description: "Alert when new items are added to folder",
      icon: <TbCheck className="text-primary" />,
    },
    {
      value: "item_removed",
      label: "Item Removed",
      description: "Alert when items are removed from folder",
      icon: <TbAlertTriangle className="text-red-500" />,
    },
  ];

  const operators = [
    { value: "less_than", label: "Less than" },
    { value: "less_than_equal", label: "Less than or equal to" },
    { value: "greater_than", label: "Greater than" },
    { value: "greater_than_equal", label: "Greater than or equal to" },
    { value: "equal", label: "Equal to" },
  ];

  const fields = [
    { value: "quantity", label: "Quantity" },
    { value: "value", label: "Total Value" },
    { value: "item_count", label: "Item Count" },
  ];

  const notificationOptions = [
    { value: "email", label: "Email", icon: <TbMail className="w-4 h-4" /> },
    { value: "sms", label: "SMS", icon: <TbPhone className="w-4 h-4" /> },
  ];

  useEffect(() => {
    if (open && folder) {
      resetForm();
      loadExistingAlerts();
    }
  }, [open, folder]);

  const loadExistingAlerts = async () => {
    if (!folder) return;

    setLoadingAlerts(true);
    try {
      const response = await getFolderAlerts(folder._id);
      const alertsData = response.data?.alerts || response.alerts || [];
      setExistingAlerts(alertsData);
    } catch (error) {
      console.error("Error loading existing alerts:", error);
      // Don't show error toast as this is not critical
    } finally {
      setLoadingAlerts(false);
    }
  };

  const resetForm = () => {
    setAlertType("low_stock");
    setAlertName("");
    setCondition({
      threshold: 5,
      operator: "less_than",
      field: "quantity",
    });
    setRecipients([""]);
    setNotificationMethods(["email"]);
    setIsEnabled(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!alertName.trim()) {
      newErrors.alertName = "Alert name is required";
    } else if (alertName.trim().length > 100) {
      newErrors.alertName = "Alert name cannot be more than 100 characters";
    }

    // Only validate threshold for threshold-based alerts
    if (alertType === "low_stock" || alertType === "high_value") {
      if (!condition.threshold && condition.threshold !== 0) {
        newErrors.threshold = "Threshold is required for this alert type";
      } else if (condition.threshold < 0) {
        newErrors.threshold = "Threshold must be a non-negative number";
      }
    }

    const validRecipients = recipients.filter((r) => r.trim());
    if (validRecipients.length === 0) {
      newErrors.recipients = "At least one recipient is required";
    }

    // Validate email format for all recipients
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validRecipients.filter(
      (r) => !emailRegex.test(r.trim())
    );
    if (invalidEmails.length > 0) {
      newErrors.recipients = "Please enter valid email addresses";
    }

    // Validate notification methods
    if (notificationMethods.length === 0) {
      newErrors.notificationMethods =
        "At least one notification method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const alertConfig = {
        name: alertName.trim(),
        type: alertType,
        condition:
          alertType === "low_stock" || alertType === "high_value"
            ? condition
            : null,
        recipients: recipients.filter((r) => r.trim()),
        notificationMethods: notificationMethods,
        enabled: isEnabled,
      };

      const response = await setFolderAlert(folder._id, alertConfig);

      if (onSave) {
        onSave(response.alert || response.data?.alert || alertConfig);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Set folder alert error:", error);

      let errorMessage = "Failed to configure alert";

      // Handle different types of errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle validation errors specifically
      if (error.response?.status === 400) {
        if (
          error.response.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const validationErrors = {};
          error.response.data.errors.forEach((err) => {
            if (err.path) {
              validationErrors[err.path] = err.msg;
            }
          });
          setErrors(validationErrors);
          return;
        }
      }

      // Handle connection errors
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast.error(errorMessage);

      // Set field-specific errors if available
      if (
        error.response?.data?.errors &&
        typeof error.response.data.errors === "object"
      ) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const addRecipient = () => {
    setRecipients((prev) => [...prev, ""]);
  };

  const removeRecipient = (index) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRecipient = (index, value) => {
    setRecipients((prev) => prev.map((r, i) => (i === index ? value : r)));
  };

  const toggleNotificationMethod = (method) => {
    setNotificationMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  if (!folder) return null;

  const selectedAlertType = alertTypes.find((t) => t.value === alertType);

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Set Folder Alert"
      maxWidth="max-w-lg"
      closeOnBackdrop={!isLoading}
    >
      <div className="mb-4 p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
        <p className="text-sm text-[var(--primary-dark)]">
          <span className="font-medium">Setting alert for:</span> {folder.name}
        </p>
      </div>

      {/* Existing Alerts */}
      {existingAlerts.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Existing Alerts</h4>
          <div className="space-y-2">
            {existingAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.enabled ? "bg-primary-light0" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium">{alert.name}</span>
                  <span className="text-gray-500">
                    ({alert.type.replace("_", " ")})
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    alert.enabled
                      ? "bg-primary-light text-[var(--primary-dark)]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {alert.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingAlerts && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">
              Loading existing alerts...
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alert Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Alert Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 ${
              errors.alertName ? "border-red-400" : "border-gray-300"
            }`}
            value={alertName}
            onChange={(e) => {
              setAlertName(e.target.value);
              if (errors.alertName) {
                setErrors((prev) => ({ ...prev, alertName: null }));
              }
            }}
            disabled={isLoading}
            placeholder="Enter alert name"
            required
          />
          {errors.alertName && (
            <p className="text-red-500 text-sm mt-1">{errors.alertName}</p>
          )}
        </div>

        {/* Alert Type */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Alert Type
          </label>
          <div className="space-y-2">
            {alertTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="alertType"
                  value={type.value}
                  checked={alertType === type.value}
                  onChange={(e) => setAlertType(e.target.value)}
                  disabled={isLoading}
                  className="mr-3"
                />
                <div className="flex items-center gap-3 flex-1">
                  {type.icon}
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500">
                      {type.description}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Condition (for threshold-based alerts) */}
        {(alertType === "low_stock" || alertType === "high_value") && (
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Condition
            </label>
            <div className="flex gap-2">
              <select
                value={condition.field}
                onChange={(e) =>
                  setCondition((prev) => ({ ...prev, field: e.target.value }))
                }
                disabled={isLoading}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              >
                {fields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>

              <select
                value={condition.operator}
                onChange={(e) =>
                  setCondition((prev) => ({
                    ...prev,
                    operator: e.target.value,
                  }))
                }
                disabled={isLoading}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              >
                {operators.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={condition.threshold}
                onChange={(e) =>
                  setCondition((prev) => ({
                    ...prev,
                    threshold: Number(e.target.value),
                  }))
                }
                disabled={isLoading}
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 ${
                  errors.threshold ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="Threshold"
                min="0"
              />
            </div>
            {errors.threshold && (
              <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>
            )}
          </div>
        )}

        {/* Recipients */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Recipients<span className="text-green-500">*</span>
          </label>
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.target.value)}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                  placeholder="Enter email address"
                />
                {recipients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    disabled={isLoading}
                    className="px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-150"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRecipient}
            disabled={isLoading}
            className="mt-2 text-sm text-primary hover:text-primary"
          >
            + Add another recipient
          </button>
          {errors.recipients && (
            <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
          )}
        </div>

        {/* Notification Methods */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Notification Methods<span className="text-green-500">*</span>
          </label>
          <div className="space-y-2">
            {notificationOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificationMethods.includes(option.value)}
                  onChange={() => {
                    toggleNotificationMethod(option.value);
                    if (errors.notificationMethods) {
                      setErrors((prev) => ({
                        ...prev,
                        notificationMethods: null,
                      }));
                    }
                  }}
                  disabled={isLoading}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.notificationMethods && (
            <p className="text-green-500 text-sm mt-1">
              {errors.notificationMethods}
            </p>
          )}
        </div>

        {/* Enable/Disable */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enableAlert"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            disabled={isLoading}
            className="rounded"
          />
          <label htmlFor="enableAlert" className="font-medium text-gray-700">
            Enable this alert
          </label>
        </div>

        {/* Alert Info */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-1">
            Alert Information
          </h4>
          <p className="text-sm text-yellow-700">
            {selectedAlertType?.description}
            {(alertType === "low_stock" || alertType === "high_value") &&
              " You can set specific conditions using the threshold settings above."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !alertName.trim()}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting Alert...
              </>
            ) : (
              <>
                <TbBell className="w-4 h-4" />
                Set Alert
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default SetFolderAlertModal;
