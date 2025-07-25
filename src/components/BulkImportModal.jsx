import { useState } from "react";
import { IoClose, IoChevronBack } from "react-icons/io5";
import {
  TbDownload,
  TbUpload,
  TbFileSpreadsheet,
  TbAlertCircle,
  TbAlertTriangle,
  TbCheck,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import { itemsService } from "../services/items";
import toast from "react-hot-toast";

const faqs = [
  {
    q: "Can I use any spreadsheet to import my items?",
    a: "No, you must use the Primarily template.",
  },
  {
    q: "How do I know whether the bulk upload feature is right for me?",
    a: "Check the documentation or contact support.",
  },
  {
    q: "What is the Primarily Import Template?",
    a: "A spreadsheet template provided by Primarily for accurate imports.",
  },
  {
    q: "What are the required fields?",
    a: "See the template for required fields.",
  },
  {
    q: "What are the basic instructions for filling out the template?",
    a: "Follow the numbered steps in the modal.",
  },
  {
    q: "What should I do if, upon uploading my template to Primarily, I receive an error message prompting me to upload my file as UTF-8?",
    a: "Save your file as UTF-8 encoded CSV or XLSX.",
  },
  {
    q: "What are the instructions for entering my data?",
    a: "See the template and instructions.",
  },
  {
    q: "Is there an example of what my spreadsheet should look like before I attempt to upload it?",
    a: "Yes, see the sample inventory tab in the template.",
  },
  {
    q: "How do I import additional data via bulk upload?",
    a: "Repeat the process with a new file.",
  },
  {
    q: "What should I do if I want to re-import inventory data to a new account?",
    a: "Contact support for guidance.",
  },
];

const BulkImportModal = ({ open, onClose, onBack }) => {
  const [file, setFile] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [step, setStep] = useState(1); // 1: upload, 2: validate, 3: import, 4: complete
  const { fetchItems, fetchFolders } = useInventory();

  const handleDownloadTemplate = async () => {
    try {
      const response = await itemsService.getImportTemplate("xlsx");
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "primarily-import-template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please select a valid Excel (.xlsx) or CSV file");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setStep(2);
    await validateFile(selectedFile);
  };

  const validateFile = async (fileToValidate) => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await itemsService.validateImport(fileToValidate);
      setValidationResult(result);

      if (result.valid) {
        const rowCount = result.totalRows || result.preview?.length || 0;
        toast.success(
          `File validated successfully! Found ${rowCount} rows to import.`
        );
      } else {
        const errorCount = result.errors?.length || 0;
        const warningCount = result.warnings?.length || 0;
        toast.error(
          `Validation failed: ${errorCount} error(s)${
            warningCount > 0 ? ` and ${warningCount} warning(s)` : ""
          } found`
        );
      }
    } catch (error) {
      toast.error("File validation failed");
      setValidationResult({
        valid: false,
        errors: [
          {
            type: "validation_error",
            message: error.response?.data?.message || "Validation failed",
            suggestion:
              "Please check your file format and try again. Download the template for reference.",
          },
        ],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file || !validationResult?.valid) {
      toast.error("Please select and validate a file first");
      return;
    }

    setIsImporting(true);
    setStep(3);
    setImportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const result = await itemsService.importItems(file, {
        skipDuplicates: true,
        updateExisting: false,
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      toast.success(`Successfully imported ${result.imported} items!`);

      if (result.skipped > 0) {
        toast.info(
          `${result.skipped} items were skipped (duplicates or errors)`
        );
      }

      // Refresh data
      await fetchItems();
      await fetchFolders();

      setStep(4);

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Import failed");
      setStep(2); // Go back to validation step
    } finally {
      setIsImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setValidationResult(null);
    setStep(1);
    setImportProgress(0);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative border border-gray-100 animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md focus:outline-none"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          aria-label="Close"
        >
          <IoClose size={28} />
        </button>
        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 min-h-0 flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-[260px]">
            <button
              onClick={onBack}
              className="flex items-center text-primary font-medium mb-4"
            >
              <IoChevronBack className="mr-1" /> Back
            </button>
            <h2 className="text-2xl font-semibold mb-6">
              Bulk Inventory Import
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700 mb-6">
              <li>
                <span className="font-medium">
                  Download Primarily Import Template
                </span>
                <div className="mt-2">
                  <button
                    className="btn-primary hover:btn-primary-hover text-white font-semibold rounded px-4 py-2"
                    onClick={handleDownloadTemplate}
                  >
                    DOWNLOAD FILE
                  </button>
                </div>
              </li>
              <li>
                <span className="font-medium">Fill in your data</span>
                <div className="text-gray-500 text-sm">
                  Check the{" "}
                  <span className="font-semibold">Sample Inventory</span> tab in
                  the template to see detailed instructions.
                </div>
              </li>
              <li>
                <span className="font-medium">Save the file</span>
                <div className="text-gray-500 text-sm">
                  Save the file in XLSX format or CSV (UTF-8).{" "}
                  <a href="#" className="text-primary underline">
                    See steps.
                  </a>
                </div>
              </li>
              <li>
                <span className="font-medium">Add file below</span>
                <div className="text-gray-500 text-sm">
                  A Primarily provided template needs to be used.
                </div>
              </li>
            </ol>
            <div className="flex gap-4 items-center mb-2">
              <input
                type="file"
                accept=".xlsx,.csv"
                className="border rounded px-3 py-2"
                onChange={handleFileSelect}
                disabled={isImporting}
              />
              <button
                className={`font-semibold rounded px-6 py-2 ${
                  file && validationResult?.valid && !isImporting
                    ? "btn-primary text-white hover:btn-primary-hover"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!file || !validationResult?.valid || isImporting}
                onClick={handleImport}
              >
                {isImporting ? "IMPORTING..." : "IMPORT"}
              </button>
            </div>
            {validationResult && (
              <div className="mt-4 space-y-3">
                {validationResult.valid ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                    <div className="flex items-center font-medium mb-2">
                      <TbCheck className="mr-2 text-green-600" />
                      File validated successfully!
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        ✓ Found{" "}
                        {validationResult.totalRows ||
                          validationResult.preview?.length ||
                          0}{" "}
                        rows to import
                      </p>
                      {validationResult.detectedColumns && (
                        <p>
                          ✓ Detected columns:{" "}
                          {validationResult.detectedColumns.join(", ")}
                        </p>
                      )}
                      {validationResult.totalFolders && (
                        <p>
                          ✓ Found {validationResult.totalFolders} folders and{" "}
                          {validationResult.totalItems} items
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-red-200 text-green-800 p-4 rounded-lg">
                    <div className="flex items-center font-medium mb-3">
                      <TbAlertCircle className="mr-2 text-red-600" />
                      Validation Failed - Please Fix These Issues:
                    </div>
                    <div className="space-y-3">
                      {validationResult.errors?.map((error, idx) => (
                        <div
                          key={idx}
                          className="bg-green-100 p-3 rounded border-l-4 border-green-400"
                        >
                          <div className="font-medium text-sm mb-1">
                            {typeof error === "string" ? error : error.message}
                          </div>
                          {error.suggestion && (
                            <div className="text-xs text-green-600 mt-1">
                              💡 {error.suggestion}
                            </div>
                          )}
                          {error.foundColumns && (
                            <div className="text-xs text-green-600 mt-1">
                              Found columns: {error.foundColumns.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.warnings &&
                  validationResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                      <div className="flex items-center font-medium mb-2">
                        <TbAlertTriangle className="mr-2 text-yellow-600" />
                        Warnings - Please Review:
                      </div>
                      <div className="space-y-2">
                        {validationResult.warnings.map((warning, idx) => (
                          <div
                            key={idx}
                            className="bg-yellow-100 p-2 rounded text-sm"
                          >
                            <div className="font-medium mb-1">
                              {typeof warning === "string"
                                ? warning
                                : warning.message}
                            </div>
                            {warning.suggestion && (
                              <div className="text-xs text-yellow-700">
                                💡 {warning.suggestion}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {validationResult.preview && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                    <div className="font-medium mb-2">
                      Preview (First 5 rows):
                    </div>
                    <div className="bg-white p-2 rounded text-xs font-mono overflow-x-auto">
                      <pre>
                        {JSON.stringify(validationResult.preview, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-[260px] bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="divide-y">
              {faqs.map((faq, idx) => (
                <div key={idx}>
                  <button
                    className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-700 focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <span>{openFaq === idx ? "-" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="text-gray-600 pb-3 pl-2 text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
