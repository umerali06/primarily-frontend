import { useState, useRef, useEffect } from "react";
import {
  Html5QrcodeScanner,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import {
  TbScan,
  TbX,
  TbCamera,
  TbCameraOff,
  TbBulb,
  TbBulbOff,
  TbRefresh,
  TbCheck,
  TbAlertCircle,
} from "react-icons/tb";
import toast from "react-hot-toast";

const BarcodeScanner = ({
  isOpen,
  onClose,
  onScanSuccess,
  onScanError,
  scanMode = "both", // 'barcode', 'qr', 'both'
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Initialize camera list
  useEffect(() => {
    if (isOpen) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          setCameras(devices);
          if (devices.length > 0) {
            // Prefer back camera for barcode scanning
            const backCamera = devices.find(
              (device) =>
                device.label.toLowerCase().includes("back") ||
                device.label.toLowerCase().includes("rear")
            );
            setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
          }
        })
        .catch((err) => {
          console.error("Error getting cameras:", err);
          setError("Unable to access cameras. Please check permissions.");
        });
    }
  }, [isOpen]);

  // Start scanning
  const startScanning = async () => {
    if (!selectedCamera) {
      setError("No camera selected");
      return;
    }

    try {
      setError(null);
      setIsScanning(true);
      setScannerReady(false);

      const html5QrCode = new Html5Qrcode("barcode-scanner-container");
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 300, height: 200 },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: "environment",
          advanced: [{ torch: flashEnabled }],
        },
      };

      // Configure supported formats based on scan mode
      const supportedFormats = [];
      if (scanMode === "barcode" || scanMode === "both") {
        supportedFormats.push(
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODABAR
        );
      }
      if (scanMode === "qr" || scanMode === "both") {
        supportedFormats.push(Html5QrcodeSupportedFormats.QR_CODE);
      }

      if (supportedFormats.length > 0) {
        config.supportedScanTypes = supportedFormats;
      }

      await html5QrCode.start(
        selectedCamera,
        config,
        (decodedText, decodedResult) => {
          handleScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // Handle scan errors silently (continuous scanning)
          // Only log non-routine scanning errors
          if (
            !errorMessage.includes("NotFoundException") &&
            !errorMessage.includes("No MultiFormat Readers")
          ) {
            console.log("Scan error:", errorMessage);
          }
        }
      );

      setScannerReady(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError(
        "Failed to start camera. Please check permissions and try again."
      );
      setIsScanning(false);
    }
  };

  // Stop scanning
  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        // Check if scanner is actually running before stopping
        const state = html5QrCodeRef.current.getState();
        if (state === 2) {
          // Html5QrcodeScannerState.SCANNING
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        // Silently handle "scanner not running" errors as they're not critical
        if (
          !err.message?.includes("not running") &&
          !err.message?.includes("paused")
        ) {
          console.error("Error stopping scanner:", err);
        }
      }
    }
    setIsScanning(false);
    setScannerReady(false);
  };

  // Handle successful scan
  const handleScanSuccess = (decodedText, decodedResult) => {
    setScanResult({
      text: decodedText,
      format: decodedResult.result.format,
      timestamp: new Date(),
    });

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Play success sound
    const audio = new Audio("/sounds/scan-success.mp3");
    audio.play().catch(() => {}); // Ignore if sound fails

    toast.success("Barcode scanned successfully!");

    if (onScanSuccess) {
      onScanSuccess(decodedText, decodedResult);
    }

    // Auto-close after successful scan
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  // Toggle flash
  const toggleFlash = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        const newFlashState = !flashEnabled;
        setFlashEnabled(newFlashState);

        // Restart scanner with new flash setting
        await stopScanning();
        setTimeout(() => {
          startScanning();
        }, 100);
      } catch (err) {
        console.error("Error toggling flash:", err);
        toast.error("Unable to toggle flash");
      }
    }
  };

  // Switch camera
  const switchCamera = async (cameraId) => {
    if (cameraId !== selectedCamera) {
      setSelectedCamera(cameraId);
      if (isScanning) {
        await stopScanning();
        setTimeout(() => {
          startScanning();
        }, 100);
      }
    }
  };

  // Handle close
  const handleClose = async () => {
    await stopScanning();
    setScanResult(null);
    setError(null);
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrCodeRef.current) {
        try {
          const state = html5QrCodeRef.current.getState();
          if (state === 2) {
            // Html5QrcodeScannerState.SCANNING
            html5QrCodeRef.current.stop().catch(() => {});
          }
          html5QrCodeRef.current.clear();
        } catch (err) {
          // Ignore cleanup errors
        }
        html5QrCodeRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <TbScan className="w-5 h-5 text-[#0a7662]" />
            <h3 className="text-lg font-semibold">
              {scanMode === "barcode"
                ? "Barcode Scanner"
                : scanMode === "qr"
                ? "QR Code Scanner"
                : "Barcode & QR Scanner"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Container */}
        <div className="p-4">
          {error && (
            <div className="bg-green-50 border border-red-200 text-green-800 px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
              <TbAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
              <TbCheck className="w-4 h-4 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Scan successful!</div>
                <div className="text-xs opacity-75">
                  Code: {scanResult.text}
                </div>
              </div>
            </div>
          )}

          {/* Camera Selection */}
          {cameras.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => switchCamera(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a7662] focus:border-[#0a7662]"
                disabled={isScanning}
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Camera ${camera.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Scanner Display */}
          <div
            className="relative bg-black rounded-lg overflow-hidden mb-4"
            style={{ aspectRatio: "4/3" }}
          >
            <div id="barcode-scanner-container" className="w-full h-full" />

            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="text-center text-white">
                  <TbCamera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Camera not active</p>
                </div>
              </div>
            )}

            {/* Scanning Overlay */}
            {isScanning && scannerReady && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Scanning frame */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 border-2 border-[#0a7662] rounded-lg">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>

                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#0a7662] animate-pulse"></div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full inline-block">
                    {scanMode === "barcode"
                      ? "Align barcode within frame"
                      : scanMode === "qr"
                      ? "Align QR code within frame"
                      : "Align barcode or QR code within frame"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isScanning ? (
              <button
                onClick={startScanning}
                disabled={!selectedCamera}
                className="flex items-center gap-2 bg-[#0a7662] text-white px-4 py-2 rounded-lg hover:bg-[#075c4c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <TbCamera className="w-4 h-4" />
                Start Scanning
              </button>
            ) : (
              <>
                <button
                  onClick={stopScanning}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <TbCameraOff className="w-4 h-4" />
                  Stop
                </button>

                <button
                  onClick={toggleFlash}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    flashEnabled
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {flashEnabled ? (
                    <TbBulbOff className="w-4 h-4" />
                  ) : (
                    <TbBulb className="w-4 h-4" />
                  )}
                  Flash
                </button>

                <button
                  onClick={() => {
                    stopScanning();
                    setTimeout(startScanning, 100);
                  }}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <TbRefresh className="w-4 h-4" />
                  Retry
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              {scanMode === "barcode"
                ? "Point your camera at a barcode to scan it"
                : scanMode === "qr"
                ? "Point your camera at a QR code to scan it"
                : "Point your camera at a barcode or QR code to scan it"}
            </p>
            <p className="text-xs mt-1 opacity-75">
              Make sure the code is well-lit and clearly visible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
