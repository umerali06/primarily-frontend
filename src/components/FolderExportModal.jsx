import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useFolders from "../hooks/useFolders";
import {
  TbDownload,
  TbFileText,
  TbTable,
  TbFile,
  TbCheck,
} from "react-icons/tb";
import toast from "react-hot-toast";

const FolderExportModal = ({ open, onClose, folder, onExport }) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeOptions, setIncludeOptions] = useState({
    items: true,
    images: false,
    history: false,
    permissions: false,
    labels: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    dateRange: "all",
    startDate: "",
    endDate: "",
    tags: [],
    minValue: "",
    maxValue: "",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const { exportFolder } = useFolders();

  const formatOptions = [
    {
      value: "csv",
      label: "CSV",
      description: "Comma-separated values for spreadsheet applications",
      icon: <TbTable className="text-primary" />,
      extension: ".csv",
    },
    {
      value: "excel",
      label: "Excel",
      description: "Microsoft Excel format with multiple sheets",
      icon: <TbFileText className="text-primary" />,
      extension: ".xlsx",
    },
    {
      value: "pdf",
      label: "PDF",
      description: "Portable document format for reports",
      icon: <TbFile className="text-green-600" />,
      extension: ".pdf",
    },
    {
      value: "json",
      label: "JSON",
      description: "JavaScript Object Notation for developers",
      icon: <TbFileText className="text-purple-600" />,
      extension: ".json",
    },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "last_week", label: "Last Week" },
    { value: "last_month", label: "Last Month" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "last_year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  useEffect(() => {
    if (open && folder) {
      resetForm();
    }
  }, [open, folder]);

  const resetForm = () => {
    setExportFormat("csv");
    setIncludeOptions({
      items: true,
      images: false,
      history: false,
      permissions: false,
      labels: false,
    });
    setFilterOptions({
      dateRange: "all",
      startDate: "",
      endDate: "",
      tags: [],
      minValue: "",
      maxValue: "",
    });
    setExportProgress(0);
  };

  const handleIncludeOptionChange = (option, checked) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: checked,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const exportOptions = {
        include: includeOptions,
        filters: filterOptions,
      };

      await exportFolder(folder._id, exportFormat, exportOptions);

      setExportProgress(100);

      if (onExport) {
        onExport(exportFormat, exportOptions);
      }

      toast.success("Folder exported successfully!");

      // Close modal after a short delay to show completion
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to export folder");
      setExportProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      resetForm();
      onClose();
    }
  };

  if (!folder) return null;

  const selectedFormat = formatOptions.find((f) => f.value === exportFormat);
  const isCustomDateRange = filterOptions.dateRange === "custom";

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Export Folder"
      maxWidth="max-w-lg"
      closeOnBackdrop={!isExporting}
    >
      <div className="space-y-4">
        {/* Folder Info */}
        <div className="p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
          <p className="text-sm text-[var(--primary-dark)]">
            <span className="font-medium">Exporting:</span> {folder.name}
          </p>
          <p className="text-xs text-primary mt-1">
            {folder.itemCount || 0} items • Total value: PKR{" "}
            {(folder.totalValue || 0).toLocaleString()}
          </p>
        </div>

        {/* Export Format */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Export Format
          </label>
          <div className="space-y-2">
            {formatOptions.map((format) => (
              <label
                key={format.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={format.value}
                  checked={exportFormat === format.value}
                  onChange={(e) => setExportFormat(e.target.value)}
                  disabled={isExporting}
                  className="mr-3"
                />
                <div className="flex items-center gap-3 flex-1">
                  {format.icon}
                  <div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-sm text-gray-500">
                      {format.description}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format.extension}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Include Options */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Include in Export
          </label>
          <div className="space-y-2">
            {Object.entries({
              items: "Item details and inventory data",
              images: "Item images and attachments",
              history: "Activity history and changes",
              permissions: "User permissions and access rights",
              labels: "Folder labels and tags",
            }).map(([key, description]) => (
              <label key={key} className="flex items-start gap-2 p-2">
                <input
                  type="checkbox"
                  checked={includeOptions[key]}
                  onChange={(e) =>
                    handleIncludeOptionChange(key, e.target.checked)
                  }
                  disabled={isExporting}
                  className="mt-1 rounded"
                />
                <div>
                  <div className="font-medium capitalize">
                    {key.replace("_", " ")}
                  </div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Options */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Filter Options
          </label>

          {/* Date Range */}
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Date Range
            </label>
            <select
              value={filterOptions.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              disabled={isExporting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range */}
          {isCustomDateRange && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filterOptions.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  disabled={isExporting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  End Date
                </label>
                <input
                  type="date"
                  value={filterOptions.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  disabled={isExporting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                />
              </div>
            </div>
          )}

          {/* Value Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Min Value (PKR)
              </label>
              <input
                type="number"
                value={filterOptions.minValue}
                onChange={(e) => handleFilterChange("minValue", e.target.value)}
                disabled={isExporting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Max Value (PKR)
              </label>
              <input
                type="number"
                value={filterOptions.maxValue}
                onChange={(e) => handleFilterChange("maxValue", e.target.value)}
                disabled={isExporting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Exporting...
              </span>
              <span className="text-sm text-gray-500">{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="btn-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            {exportProgress === 100 && (
              <div className="flex items-center gap-2 mt-2 text-primary">
                <TbCheck className="w-4 h-4" />
                <span className="text-sm">Export completed successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* Preview Info */}
        {!isExporting && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Export Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                Format: {selectedFormat?.label} ({selectedFormat?.extension})
              </div>
              <div>Items: {includeOptions.items ? "Included" : "Excluded"}</div>
              <div>
                Date Range:{" "}
                {
                  dateRangeOptions.find(
                    (d) => d.value === filterOptions.dateRange
                  )?.label
                }
              </div>
              <div>
                Additional Data:{" "}
                {
                  Object.entries(includeOptions).filter(
                    ([key, value]) => key !== "items" && value
                  ).length
                }{" "}
                types included
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? "Exporting..." : "Cancel"}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !includeOptions.items}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <TbDownload className="w-4 h-4" />
                Export Folder
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FolderExportModal;
