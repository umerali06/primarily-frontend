import React from "react";
import { TbBell, TbUser, TbChevronDown, TbSearch } from "react-icons/tb";
import PrimarilyLogo from "./PrimarilyLogo";

const DashboardNavbar = ({
  title,
  user,
  onProfileClick,
  onNotificationsClick,
  notificationCount = 0,
}) => {
  // Helper function to get display name with proper fallbacks
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    return "User";
  };

  // Helper function to get email with proper fallback
  const getDisplayEmail = () => {
    if (user?.email) return user.email;
    return "user@example.com";
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Title and Mobile Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Logo - only visible on mobile */}
          <div className="lg:hidden">
            <PrimarilyLogo className="h-8" showText={false} />
          </div>

          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Center Section - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <TbSearch size={20} />
          </button>

          {/* Notifications */}
          <button
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onNotificationsClick}
          >
            <TbBell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onProfileClick}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <TbUser className="text-white" size={16} />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {getDisplayName()}
              </div>
              <div className="text-xs text-gray-500">
                {getDisplayEmail()}
              </div>
            </div>
            <TbChevronDown className="hidden sm:block text-gray-400 w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
