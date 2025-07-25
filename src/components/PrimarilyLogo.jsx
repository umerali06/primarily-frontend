import React from "react";

const PrimarilyLogo = ({ className = "h-8", showText = true }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="primaryGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="var(--primary-color)" />
          <stop offset="100%" stopColor="var(--primary-hover)" />
        </linearGradient>
      </defs>

      {/* Logo Icon */}
      <rect
        x="4"
        y="8"
        width="24"
        height="24"
        rx="6"
        fill="url(#primaryGradient)"
      />
      <rect
        x="8"
        y="12"
        width="4"
        height="16"
        rx="2"
        fill="white"
        opacity="0.9"
      />
      <rect
        x="16"
        y="16"
        width="4"
        height="12"
        rx="2"
        fill="white"
        opacity="0.7"
      />
      <rect
        x="20"
        y="20"
        width="4"
        height="8"
        rx="2"
        fill="white"
        opacity="0.5"
      />

      {/* Logo Text */}
      {showText && (
        <text
          x="36"
          y="26"
          fill="var(--primary-color)"
          fontSize="18"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Primarily
        </text>
      )}
    </svg>
  );
};

export default PrimarilyLogo;
