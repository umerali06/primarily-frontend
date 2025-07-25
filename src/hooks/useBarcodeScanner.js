import { useState, useCallback } from "react";
import { itemsService } from "../services/items";
import toast from "react-hot-toast";

export const useBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [lastScanResult, setLastScanResult] = useState(null);

  // Open scanner
  const openScanner = useCallback(() => {
    setIsScanning(true);
  }, []);

  // Close scanner
  const closeScanner = useCallback(() => {
    setIsScanning(false);
  }, []);

  // Handle successful scan
  const handleScanSuccess = useCallback(async (scannedCode, scanResult) => {
    try {
      setLastScanResult({
        code: scannedCode,
        format: scanResult.result.format,
        timestamp: new Date(),
      });

      // Add to scan history
      setScanHistory((prev) => [
        {
          code: scannedCode,
          format: scanResult.result.format,
          timestamp: new Date(),
          id: Date.now(),
        },
        ...prev.slice(0, 49),
      ]); // Keep last 50 scans

      // Try to find item by barcode
      const foundItem = await itemsService.findByBarcode(scannedCode);

      if (foundItem) {
        toast.success(`Item found: ${foundItem.name}`);
        return {
          success: true,
          item: foundItem,
          action: "found",
        };
      } else {
        // Item not found, suggest creating new item
        toast.info(
          "Item not found. Would you like to create a new item with this barcode?"
        );
        return {
          success: true,
          item: null,
          action: "create",
          barcode: scannedCode,
        };
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      toast.error("Error processing barcode scan");
      return {
        success: false,
        error: error.message,
      };
    }
  }, []);

  // Handle scan error
  const handleScanError = useCallback((error) => {
    console.error("Scan error:", error);
    toast.error("Scanning failed. Please try again.");
  }, []);

  // Clear scan history
  const clearScanHistory = useCallback(() => {
    setScanHistory([]);
  }, []);

  // Get scan statistics
  const getScanStats = useCallback(() => {
    const total = scanHistory.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayScans = scanHistory.filter(
      (scan) => scan.timestamp >= today
    ).length;

    const formatCounts = scanHistory.reduce((acc, scan) => {
      acc[scan.format] = (acc[scan.format] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      today: todayScans,
      formats: formatCounts,
      lastScan: scanHistory[0] || null,
    };
  }, [scanHistory]);

  return {
    isScanning,
    scanHistory,
    lastScanResult,
    openScanner,
    closeScanner,
    handleScanSuccess,
    handleScanError,
    clearScanHistory,
    getScanStats,
  };
};
