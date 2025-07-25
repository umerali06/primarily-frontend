import React from "react";

const SpotlightTour = ({
  tourStep,
  TOUR_STEPS,
  tabRefs,
  GREEN,
  userName,
  handleTourNext,
  ConfettiEffect,
}) => {
  if (tourStep === null) return null;
  const step = TOUR_STEPS[tourStep];
  const ref = tabRefs[step.tab];
  const rect = ref.current?.getBoundingClientRect();
  if (!rect) return null;
  // Calculate overlay position
  const overlayStyle = {
    position: "fixed",
    left: rect.left - 8,
    top: rect.top - 8,
    width: rect.width + 16,
    height: rect.height + 16,
    borderRadius: 12,
    boxShadow: `0 0 0 4px ${GREEN.light}, 0 0 0 9999px rgba(0,0,0,0.5)`,
    zIndex: 100,
    pointerEvents: "none",
    transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
  };
  // Tooltip position (right of tab, vertically centered)
  const tooltipStyle = {
    position: "fixed",
    left: rect.right + 24,
    top: rect.top + rect.height / 2,
    transform: "translateY(-50%)",
    zIndex: 101,
    minWidth: 320,
    maxWidth: 360,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    padding: 24,
    border: `2px solid ${GREEN.main}`,
    color: GREEN.text,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    animation: "fadeIn 0.2s cubic-bezier(.4,2,.6,1)",
  };
  // Arrow position
  const arrowStyle = {
    position: "fixed",
    left: rect.right + 8,
    top: rect.top + rect.height / 2 - 12,
    zIndex: 102,
    width: 24,
    height: 24,
    pointerEvents: "none",
  };
  return (
    <>
      {/* Spotlight highlight */}
      <div style={overlayStyle}></div>
      {/* Arrow */}
      <svg style={arrowStyle} viewBox="0 0 24 24">
        <polygon points="0,12 24,0 24,24" fill={GREEN.main} />
      </svg>
      {/* Tooltip */}
      <div style={tooltipStyle}>
        <h2 className="text-xl font-bold mb-2" style={{ color: GREEN.main }}>
          {typeof step.title === "function" ? step.title(userName) : step.title}
        </h2>
        <p className="mb-4 text-gray-700">{step.desc}</p>
        <button
          className="px-6 py-2 rounded font-semibold text-base border btn-primary text-white hover:btn-primary-hover shadow"
          onClick={handleTourNext}
          style={{ pointerEvents: "auto" }}
        >
          {step.button}
        </button>
        {step.confetti && ConfettiEffect && <ConfettiEffect />}
      </div>
    </>
  );
};

export default SpotlightTour;
