import React, { useState, useEffect } from "react";
import {
  TbChevronLeft,
  TbChevronRight,
  TbX,
  TbArrowLeft,
  TbArrowRight,
  TbZoomIn,
  TbDownload,
  TbPhoto,
  TbLoader,
} from "react-icons/tb";

const ImageGallery = ({ images = [], alt = "Image", onClose = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    // Reset loading state when image changes
    setIsLoading(true);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        if (showZoom) {
          setShowZoom(false);
        } else if (onClose) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, showZoom, onClose]);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      handleNext();
    } else if (touchStart - touchEnd < -100) {
      // Swipe right
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!images[currentIndex]) return;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = images[currentIndex];

    // Extract filename from URL or use a default name
    const filename =
      images[currentIndex].split("/").pop() || `image-${currentIndex + 1}.jpg`;
    link.download = filename;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <TbPhoto size={48} className="mb-2 opacity-30" />
        <p>No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        <div className="relative">
          <div
            className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <TbLoader size={32} className="text-primary animate-spin" />
              </div>
            )}
            <img
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              className={`object-contain w-full h-full cursor-pointer transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onClick={() => setShowZoom(true)}
              onLoad={handleImageLoad}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <TbChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <TbChevronRight size={20} />
              </button>
            </>
          )}

          {/* Action buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <button
              onClick={() => setShowZoom(true)}
              className="p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Zoom image"
            >
              <TbZoomIn size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Download image"
            >
              <TbDownload size={18} />
            </button>
          </div>
        </div>

        {/* Pagination indicators */}
        {images.length > 1 && (
          <>
            <div className="flex justify-center gap-2 mt-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? "btn-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
          </>
        )}

        {/* Thumbnails for quick navigation */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 pb-2 px-1 -mx-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  currentIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                aria-label={`Select image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Zoom View */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowZoom(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setShowZoom(false)}
            aria-label="Close zoom view"
          >
            <TbX size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[90vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <TbLoader size={48} className="text-white animate-spin" />
              </div>
            )}
            <img
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onLoad={handleImageLoad}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Previous image"
                >
                  <TbArrowLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Next image"
                >
                  <TbArrowRight size={24} />
                </button>
              </>
            )}

            {/* Pagination indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Download button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Download image"
            >
              <TbDownload size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
