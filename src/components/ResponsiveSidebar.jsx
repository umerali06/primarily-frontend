import React, { useState, useEffect } from "react";
import { TbMenu2, TbX } from "react-icons/tb";
import PrimarilyLogo from "./PrimarilyLogo";

const ResponsiveSidebar = ({
  tabs,
  actions,
  activeTab,
  onTabChange,
  onActionClick,
  isScanning,
  scanHistory,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [activeTab, isMobile]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = ({ isMobileDrawer = false }) => (
    <div className="flex flex-col h-full w-full">
      {/* Logo/Header */}
      <div className="flex items-center justify-center py-6 border-b border-white/10">
        {isMobileDrawer ? (
          <div className="flex items-center justify-between w-full px-6">
            <PrimarilyLogo className="h-8" showText={true} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <TbX size={24} />
            </button>
          </div>
        ) : (
          <div className="text-3xl font-bold text-white select-none">P</div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        <div className="space-y-2 px-2">
          {tabs.map((tab) => (
            <div key={tab.key} className="relative sidebar-item">
              <button
                className={`w-full flex items-center justify-center lg:justify-center transition-all duration-200 rounded-lg text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/20 focus:outline-none ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white shadow-lg border-l-4 border-white/40"
                    : ""
                } ${isMobileDrawer ? "h-14 px-4" : "h-12 w-12"}`}
                onClick={() => onTabChange(tab.key)}
                aria-label={tab.label}
              >
                <span className="text-2xl flex items-center justify-center flex-shrink-0">
                  {tab.icon}
                </span>
                {isMobileDrawer && (
                  <span className="ml-4 font-medium text-left flex-1">
                    {tab.label}
                  </span>
                )}
              </button>

              {/* Desktop Tooltip */}
              {!isMobileDrawer && (
                <div className="sidebar-tooltip">
                  <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-2xl border border-gray-700">
                    {tab.label}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="my-4">
            <div className="h-px bg-white/20 mx-2"></div>
          </div>

          {/* Action Buttons */}
          {actions.map((action) => (
            <div key={action.key} className="relative sidebar-item">
              <button
                className={`w-full flex items-center justify-center lg:justify-center transition-all duration-200 rounded-lg text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/20 focus:outline-none ${
                  (isScanning && action.key === "scanner") || action.active
                    ? "bg-white/20 text-white shadow-lg"
                    : ""
                } ${isMobileDrawer ? "h-14 px-4" : "h-12 w-12"}`}
                onClick={() => onActionClick(action)}
                aria-label={action.label}
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{action.icon}</span>
                  {/* Scan indicator */}
                  {isScanning && action.key === "scanner" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                {isMobileDrawer && (
                  <div className="ml-4 flex-1 text-left">
                    <span className="font-medium block">{action.label}</span>
                    {scanHistory.length > 0 && action.key === "scanner" && (
                      <span className="text-xs text-white/70">
                        {scanHistory.length} recent scans
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Desktop Tooltip */}
              {!isMobileDrawer && (
                <div className="sidebar-tooltip">
                  <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-2xl border border-gray-700">
                    {action.label}
                    {scanHistory.length > 0 && action.key === "scanner" && (
                      <div className="text-xs opacity-75 mt-1">
                        {scanHistory.length} recent scans
                      </div>
                    )}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <TbMenu2 size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-20 flex-col bg-primary z-40 shadow-xl border-r border-primary-hover">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-primary z-50 transform transition-transform duration-300 ease-in-out shadow-2xl animate-slide-in-left ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent isMobileDrawer={true} />
      </aside>
    </>
  );
};

export default ResponsiveSidebar;
