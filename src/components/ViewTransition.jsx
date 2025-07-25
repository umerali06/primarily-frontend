import React, { useState, useEffect } from "react";

/**
 * ViewTransition component for smooth transitions between different view modes
 *
 * @param {string} viewMode - Current view mode
 * @param {React.ReactNode} children - Content to render
 * @returns {React.ReactNode}
 */
const ViewTransition = ({ viewMode, children }) => {
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Start transition when viewMode changes
    setIsTransitioning(true);

    // After a short delay, update the displayed children
    const timer = setTimeout(() => {
      setDisplayedChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [viewMode, children]);

  return (
    <div
      className={`transition-all duration-200 ${
        isTransitioning
          ? "opacity-0 scale-95"
          : "opacity-100 scale-100 animate-view-transition"
      }`}
    >
      {displayedChildren}
    </div>
  );
};

export default ViewTransition;
