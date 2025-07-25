import React from "react";

const DashboardLayout = ({ sidebar, navbar, children, className = "" }) => {
  return (
    <div className="dashboard-container min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="sidebar-container">
        {sidebar}
      </div>

      {/* Main Content Area */}
      <div className="content-with-sidebar min-h-screen flex flex-col">
        {/* Navbar */}
        <div className="w-full">
          {navbar}
        </div>

        {/* Page Content */}
        <main className={`flex-1 no-horizontal-overflow ${className}`}>
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
