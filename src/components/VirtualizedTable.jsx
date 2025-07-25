import React, { useState, useEffect, useRef } from "react";

/**
 * VirtualizedTable component for rendering large tables with virtualization
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Items to display in the table
 * @param {Function} props.renderRow - Function to render a row
 * @param {React.ReactNode} props.headerContent - Table header content
 * @param {number} props.rowHeight - Height of each row in pixels
 * @param {number} props.overscan - Number of extra rows to render above and below the visible area
 * @returns {React.ReactNode}
 */
const VirtualizedTable = ({
  items,
  renderRow,
  headerContent,
  rowHeight = 60,
  overscan = 5,
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate visible range based on scroll position
  const calculateVisibleRange = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.floor(scrollTop / rowHeight);
    const visibleRowCount = Math.ceil(clientHeight / rowHeight);
    const end = Math.min(start + visibleRowCount + overscan, items.length);

    setVisibleRange({
      start: Math.max(0, start - overscan),
      end,
    });
  };

  // Handle scroll event
  const handleScroll = () => {
    requestAnimationFrame(calculateVisibleRange);
  };

  // Update container height when items change
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
    calculateVisibleRange();
  }, [items]);

  // Set up resize observer
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
        calculateVisibleRange();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Calculate total height of all rows
  const totalHeight = items.length * rowHeight;

  // Calculate offset for visible rows
  const offsetY = visibleRange.start * rowHeight;

  // Get visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className="overflow-auto h-full max-h-[calc(100vh-200px)]"
      onScroll={handleScroll}
    >
      <table className="min-w-full divide-y divide-gray-200">
        {headerContent}
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Spacer to push content down */}
          {visibleRange.start > 0 && (
            <tr style={{ height: `${offsetY}px` }}></tr>
          )}

          {/* Visible rows */}
          {visibleItems.map((item, index) =>
            renderRow(item, visibleRange.start + index)
          )}

          {/* Spacer for bottom rows */}
          {visibleRange.end < items.length && (
            <tr
              style={{
                height: `${totalHeight - visibleRange.end * rowHeight}px`,
              }}
            ></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VirtualizedTable;
