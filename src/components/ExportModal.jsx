import React, { useState } from "react";
import {
  TbFileSpreadsheet,
  TbFileText,
  TbCloudUpload,
  TbDownload,
  TbSettings,
  TbCalendar,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import { itemsService } from "../services/items";
import toast from "react-hot-toast";

const EXPORT_TYPES = [
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    desc: "CSV, XLSX",
    icon: <TbFileSpreadsheet className="text-3xl text-gray-400 mr-3" />,
    preview: "Export your data as a spreadsheet (CSV or XLSX).",
  },
  {
    id: "pages",
    label: "Page(s)",
    desc: "PDF",
    icon: <TbFileText className="text-3xl text-gray-400 mr-3" />,
    preview: "Export your data as a PDF document.",
  },
  {
    id: "integrations",
    label: "Integrations",
    desc: "Dropbox",
    icon: <TbCloudUpload className="text-3xl text-gray-400 mr-3" />,
    preview: "Export directly to Dropbox (integration required).",
  },
];

const ExportModal = ({ open, onClose, onNext, selectedItems = [] }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: "xlsx",
    includeImages: false,
    includeHistory: false,
    dateRange: "all",
    customFields: [],
    filters: {},
  });
  const [step, setStep] = useState(1); // 1: type selection, 2: options, 3: export
  const { exportReport, items, folders } = useInventory();

  const handleNext = () => {
    if (!selectedType) {
      toast.error("Please select an export type");
      return;
    }
    setStep(2);
  };

  const handleExport = async () => {
    if (!selectedType) return;

    setIsExporting(true);
    setStep(3);

    try {
      let format = exportOptions.format;

      // Ensure format is valid - server only supports CSV and JSON
      if (selectedType === "spreadsheet") {
        format = format === "xlsx" ? "csv" : format;
      } else if (selectedType === "pages") {
        format = "pdf";
      }

      // Prepare export parameters - only include what the server expects
      const exportParams = {};

      // Add filters if they exist
      if (exportOptions.filters) {
        if (exportOptions.filters.folderId) {
          exportParams.folderId = exportOptions.filters.folderId;
        }

        if (
          exportOptions.filters.tags &&
          exportOptions.filters.tags.length > 0
        ) {
          exportParams.tags = exportOptions.filters.tags.join(",");
        }

        if (exportOptions.filters.lowStock) {
          exportParams.lowStock = exportOptions.filters.lowStock.toString();
        }
      }

      // If specific items are selected, export only those
      if (selectedItems && selectedItems.length > 0) {
        // Make sure we're sending itemIds as a string, not an array
        const itemIds = selectedItems
          .map((item) => item._id || item.id)
          .filter(Boolean);
        if (itemIds.length > 0) {
          exportParams.itemIds = itemIds.join(",");
        }
      }

      let response;

      if (selectedType === "spreadsheet") {
        response = await itemsService.exportItems(format, exportParams);
      } else if (selectedType === "pages") {
        response = await exportReport("inventory-summary", "pdf", exportParams);
      } else {
        // For integrations, we'll use a different approach
        response = await itemsService.exportItems("json", exportParams);
      }

      // Handle the blob response
      const blob = new Blob([response.data], {
        type: getContentType(format),
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inventory-export-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Export completed successfully!");

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Export error:", error);

      // Improved error handling
      let errorMessage = "Export failed";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message || "Invalid export parameters";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to export items";
        } else if (error.response.status === 404) {
          errorMessage = "No items found to export";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error during export";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Export timeout - please try with fewer items";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setStep(2); // Go back to options
    } finally {
      setIsExporting(false);
    }
  };

  const getContentType = (format) => {
    switch (format) {
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "csv":
        return "text/csv";
      case "pdf":
        return "application/pdf";
      case "json":
        return "application/json";
      default:
        return "application/octet-stream";
    }
  };

  if (!open) return null;

  const selected = EXPORT_TYPES.find((t) => t.id === selectedType);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative animate-fadeIn flex flex-col"
        style={{ minHeight: 500 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-xl font-semibold text-gray-700">Export</div>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Main content */}
        <div className="flex flex-1 w-full">
          {/* Left: Export Types */}
          <div className="w-1/3 bg-white px-8 py-6 flex flex-col gap-4 border-r border-gray-100">
            <div className="mb-2 text-gray-500 font-medium tracking-wide">
              EXPORT TYPE
            </div>
            {EXPORT_TYPES.map((type) => (
              <button
                key={type.id}
                className={`flex items-center w-full p-4 rounded-xl border-2 transition-all duration-150 text-left mb-2 ${
                  selectedType === type.id
                    ? "border-primary bg-primary-light"
                    : "border-transparent bg-white hover:border-gray-200"
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.icon}
                <div>
                  <div className="font-semibold text-gray-800">
                    {type.label}
                  </div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </div>
              </button>
            ))}
          </div>
          {/* Right: Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-tr-2xl rounded-br-2xl">
            <div className="text-gray-400 text-base text-center">
              {selected
                ? selected.preview
                : "Choose export type to see preview"}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <span className="text-gray-400 font-medium">Step 1 of 2</span>
          <button
            className={`px-8 py-3 rounded-lg font-semibold text-white ${
              selectedType && !isExporting
                ? "btn-primary hover:btn-primary-hover"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            disabled={!selectedType || isExporting}
            onClick={handleExport}
          >
            {isExporting ? "EXPORTING..." : "EXPORT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
