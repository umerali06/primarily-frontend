import { useState, useEffect } from "react";
import {
  TbScan,
  TbX,
  TbSearch,
  TbBarcode,
  TbQrcode,
  TbPlus,
  TbEye,
  TbEdit,
  TbClock,
  TbCheck,
  TbAlertCircle,
} from "react-icons/tb";
import BarcodeScanner from "./BarcodeScanner";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { itemsService } from "../services/items";
import toast from "react-hot-toast";

const BarcodeSearchModal = ({
  isOpen,
  onClose,
  onItemFound,
  onCreateItem,
  onItemSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  const {
    isScanning,
    scanHistory,
    openScanner,
    closeScanner,
    handleScanSuccess,
    handleScanError,
    getScanStats,
  } = useBarcodeScanner();

  // Handle barcode scan success
  const onScanSuccess = async (scannedCode, scanResult) => {
    const result = await handleScanSuccess(scannedCode, scanResult);

    if (result.success) {
      if (result.item) {
        setSelectedItem(result.item);
        setShowItemDetails(true);
        if (onItemFound) {
          onItemFound(result.item);
        }
      } else if (result.action === "create") {
        // Show create item option
        if (onCreateItem) {
          onCreateItem(result.barcode);
        }
      }
    }

    closeScanner();
  };

  // Search items by barcode/name
  const searchItems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await itemsService.searchByBarcode(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchItems(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
    onClose();
  };

  // Format barcode for display
  const formatBarcode = (code, format) => {
    if (!code) return "No barcode";
    return `${code} (${format || "Unknown"})`;
  };

  // Get scan statistics
  const scanStats = getScanStats();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <TbScan className="w-6 h-6 text-[#0a7662]" />
              <h2 className="text-xl font-semibold">
                Barcode Scanner & Search
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Scanner Controls */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={openScanner}
                className="flex items-center gap-2 bg-[#0a7662] text-white px-4 py-2 rounded-lg hover:bg-[#075c4c] transition-colors"
              >
                <TbScan className="w-4 h-4" />
                Scan Barcode
              </button>
              <button
                onClick={() => openScanner()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TbQrcode className="w-4 h-4" />
                Scan QR Code
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by barcode, item name, or SKU..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a7662] focus:border-[#0a7662]"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0a7662]"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Search Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleItemSelect(item)}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={(() => {
                            const image = item.images[0];
                            if (typeof image === "string") {
                              return image;
                            } else if (image?.url) {
                              return image.url;
                            } else if (image?.filename) {
                              // Construct URL from filename
                              const baseUrl =
                                import.meta.env.VITE_API_URL?.replace(
                                  "/api",
                                  ""
                                ) || "http://localhost:5001";
                              return `${baseUrl}/uploads/items/${image.filename}`;
                            }
                            return null;
                          })()}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      {(!item.images || item.images.length === 0) && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <TbBarcode className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      {/* Fallback div for broken images */}
                      <div
                        className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <TbBarcode className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatBarcode(item.barcode, item.barcodeFormat)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} •{" "}
                          {item.folder?.name || "No folder"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowItemDetails(true);
                          }}
                          className="p-2 text-gray-400 hover:text-[#0a7662] transition-colors"
                        >
                          <TbEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Recent Scans</h3>
                  <div className="text-sm text-gray-600">
                    {scanStats.total} total • {scanStats.today} today
                  </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {scanHistory.slice(0, 10).map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <TbClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-gray-900 truncate">
                          {scan.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          {scan.format} • {scan.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => searchItems(scan.code)}
                        className="p-1 text-gray-400 hover:text-[#0a7662] transition-colors"
                      >
                        <TbSearch className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-8">
                <TbAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  No items match your search query "{searchQuery}"
                </p>
                {onCreateItem && (
                  <button
                    onClick={() => onCreateItem(searchQuery)}
                    className="flex items-center gap-2 bg-[#0a7662] text-white px-4 py-2 rounded-lg hover:bg-[#075c4c] transition-colors mx-auto"
                  >
                    <TbPlus className="w-4 h-4" />
                    Create New Item
                  </button>
                )}
              </div>
            )}

            {/* Instructions */}
            {!searchQuery && scanHistory.length === 0 && (
              <div className="text-center py-8">
                <TbScan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Scan or Search for Items
                </h3>
                <p className="text-gray-600 mb-4">
                  Use the camera to scan barcodes or QR codes, or search
                  manually
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={openScanner}
                    className="flex items-center gap-2 bg-[#0a7662] text-white px-4 py-2 rounded-lg hover:bg-[#075c4c] transition-colors"
                  >
                    <TbScan className="w-4 h-4" />
                    Start Scanning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={isScanning}
        onClose={closeScanner}
        onScanSuccess={onScanSuccess}
        onScanError={handleScanError}
        scanMode="both"
      />

      {/* Item Details Modal */}
      {showItemDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Item Details</h3>
              <button
                onClick={() => setShowItemDetails(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedItem.images && selectedItem.images.length > 0 && (
                <img
                  src={(() => {
                    const image = selectedItem.images[0];
                    if (typeof image === "string") {
                      return image;
                    } else if (image?.url) {
                      return image.url;
                    } else if (image?.filename) {
                      // Construct URL from filename
                      const baseUrl =
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:5001";
                      return `${baseUrl}/uploads/items/${image.filename}`;
                    }
                    return null;
                  })()}
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <h4 className="text-xl font-semibold mb-2">
                {selectedItem.name}
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Barcode:</span>{" "}
                  {formatBarcode(
                    selectedItem.barcode,
                    selectedItem.barcodeFormat
                  )}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {selectedItem.quantity}
                </p>
                <p>
                  <span className="font-medium">Folder:</span>{" "}
                  {selectedItem.folder?.name || "No folder"}
                </p>
                {selectedItem.description && (
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedItem.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleItemSelect(selectedItem)}
                  className="flex items-center gap-2 bg-[#0a7662] text-white px-4 py-2 rounded-lg hover:bg-[#075c4c] transition-colors"
                >
                  <TbCheck className="w-4 h-4" />
                  Select Item
                </button>
                <button
                  onClick={() => {
                    // Handle edit item
                    setShowItemDetails(false);
                  }}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <TbEdit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarcodeSearchModal;
