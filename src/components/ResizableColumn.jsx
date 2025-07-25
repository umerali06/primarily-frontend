import React, { useState, useRef, useEffect } from "react";

/**
 * ResizableColumn component for table columns that can be resized by dragging
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Column content
 * @param {number} props.width - Initial column width
 * @param {Function} props.onResize - Callback when column is resized
 * @param {string} props.columnId - ID of the column
 * @returns {React.ReactNode}
 */
const ResizableColumn = ({ children, width, onResize, columnId }) => {
  const [columnWidth, setColumnWidth] = useState(width || 150);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(columnWidth);
  const columnRef = useRef(null);

  // Handle mouse down on resize handle
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = columnWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse move during resize
  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(80, startWidthRef.current + deltaX); // Minimum width of 80px

    setColumnWidth(newWidth);
    if (onResize) {
      onResize(columnId, newWidth);
    }
  };

  // Handle mouse up to end resize
  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <th
      ref={columnRef}
      className={`relative ${isResizing ? "select-none" : ""}`}
      style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}
    >
      <div className="flex items-center h-full">
        <div className="flex-1 overflow-hidden">{children}</div>
        <div
          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize group"
          onMouseDown={handleMouseDown}
        >
          <div
            className={`w-0.5 h-full mx-auto bg-gray-300 group-hover:bg-primary-light0 transition-colors ${
              isResizing ? "bg-primary-light0" : ""
            }`}
          ></div>
        </div>
      </div>
    </th>
  );
};

export default ResizableColumn;
