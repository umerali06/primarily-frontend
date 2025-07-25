import React, { useState, useRef, useEffect } from "react";
import { TbInfoCircle, TbHelpCircle, TbAlertCircle } from "react-icons/tb";

/**
 * Tooltip component for displaying contextual help
 */
const Tooltip = ({
  children,
  content,
  position = "top",
  type = "info",
  showIcon = true,
  iconSize = 14,
  maxWidth = 250,
  className = "",
  delay = 0,
  interactive = false,
  showOnClick = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = containerRect.top + scrollTop - tooltipRect.height - 8;
        left =
          containerRect.left +
          scrollLeft +
          containerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "bottom":
        top = containerRect.bottom + scrollTop + 8;
        left =
          containerRect.left +
          scrollLeft +
          containerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "left":
        top =
          containerRect.top +
          scrollTop +
          containerRect.height / 2 -
          tooltipRect.height / 2;
        left = containerRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case "right":
        top =
          containerRect.top +
          scrollTop +
          containerRect.height / 2 -
          tooltipRect.height / 2;
        left = containerRect.right + scrollLeft + 8;
        break;
      default:
        top = containerRect.top + scrollTop - tooltipRect.height - 8;
        left =
          containerRect.left +
          scrollLeft +
          containerRect.width / 2 -
          tooltipRect.width / 2;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    // Adjust vertical position if needed
    if (top < 10) {
      top = containerRect.bottom + scrollTop + 8; // Flip to bottom
    } else if (top + tooltipRect.height > viewportHeight + scrollTop - 10) {
      top = containerRect.top + scrollTop - tooltipRect.height - 8; // Flip to top
    }

    setTooltipPosition({ top, left });
  };

  // Show tooltip
  const showTooltip = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setTimeout(calculatePosition, 0);
      }, delay);
    } else {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Toggle tooltip
  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "info":
        return <TbInfoCircle size={iconSize} />;
      case "help":
        return <TbHelpCircle size={iconSize} />;
      case "warning":
        return <TbAlertCircle size={iconSize} />;
      default:
        return <TbInfoCircle size={iconSize} />;
    }
  };

  // Get tooltip arrow position class
  const getArrowClass = () => {
    switch (position) {
      case "top":
        return "after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-gray-800";
      case "bottom":
        return "after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-gray-800";
      case "left":
        return "after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-gray-800";
      case "right":
        return "after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-gray-800";
      default:
        return "after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-gray-800";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center relative ${className}`}
      onMouseEnter={!showOnClick ? showTooltip : undefined}
      onMouseLeave={!showOnClick ? hideTooltip : undefined}
      onClick={showOnClick ? toggleTooltip : undefined}
    >
      {showIcon && (
        <span
          className={`text-gray-400 hover:text-gray-600 ${
            children ? "mr-1" : ""
          }`}
        >
          {getIcon()}
        </span>
      )}

      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 ${
            interactive ? "pointer-events-auto" : "pointer-events-none"
          } after:absolute after:content-[''] after:border-4 after:border-transparent ${getArrowClass()}`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: `${maxWidth}px`,
          }}
          onMouseEnter={interactive ? () => {} : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
