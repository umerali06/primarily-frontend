import React, { useState, useEffect } from "react";
import {
  TbX,
  TbHistory,
  TbCalendar,
  TbUser,
  TbPackage,
  TbArrowUp,
  TbArrowDown,
  TbEdit,
  TbTrash,
  TbRefresh,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import toast from "react-hot-toast";

const ItemHistoryModal = ({ open, onClose, item }) => {
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const {
    fetchItemActivities,
    activities,
    activitiesLoading: isLoading,
    activitiesError,
  } = useInventory();

  useEffect(() => {
    if (open && item) {
      loadItemHistory();
    }
  }, [open, item]);

  const loadItemHistory = async () => {
    try {
      console.log("🔄 Loading item history for item:", item._id);
      await fetchItemActivities(item._id);
      console.log("✅ Item activities loaded:", activities);
    } catch (error) {
      console.error("❌ Failed to load item history:", error);
      toast.error("Failed to load item history");
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "item_create":
      case "create":
        return <TbPackage className="text-green-600" size={20} />;
      case "item_update":
      case "update":
        return <TbEdit className="text-blue-600" size={20} />;
      case "item_delete":
      case "delete":
        return <TbTrash className="text-red-600" size={20} />;
      case "quantity_change":
      case "quantity_increase":
        return <TbArrowUp className="text-green-600" size={20} />;
      case "quantity_decrease":
        return <TbArrowDown className="text-orange-600" size={20} />;
      case "move":
        return <TbPackage className="text-purple-600" size={20} />;
      case "tag_update":
        return <TbEdit className="text-indigo-600" size={20} />;
      case "image_upload":
      case "image_delete":
        return <TbEdit className="text-pink-600" size={20} />;
      default:
        return <TbHistory className="text-gray-600" size={20} />;
    }
  };

  const getActivityDescription = (activity) => {
    const activityType = activity.type || activity.action;
    switch (activityType) {
      case "item_create":
      case "create":
        return `Item was created`;
      case "item_update":
      case "update":
        return `Item details were updated`;
      case "item_delete":
      case "delete":
        return `Item was deleted`;
      case "quantity_change":
        const change = activity.details?.change || 0;
        if (change > 0) {
          return `Quantity increased by ${change}`;
        } else if (change < 0) {
          return `Quantity decreased by ${Math.abs(change)}`;
        } else {
          return `Quantity was updated`;
        }
      case "quantity_increase":
        return `Quantity increased by ${activity.details?.change || 0}`;
      case "quantity_decrease":
        return `Quantity decreased by ${Math.abs(
          activity.details?.change || 0
        )}`;
      case "move":
        return `Item was moved to a different folder`;
      case "tag_update":
        return `Item tags were updated`;
      case "image_upload":
        return `Item image was uploaded`;
      case "image_delete":
        return `Item image was deleted`;
      default:
        return activity.description || activity.title || "Activity recorded";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const filterByDateRange = (activity) => {
    if (dateRange === "all") return true;

    const activityDate = new Date(activity.createdAt);
    const now = new Date();

    switch (dateRange) {
      case "today":
        return activityDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return activityDate >= weekAgo;
      case "month":
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return activityDate >= monthAgo;
      case "year":
        const yearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return activityDate >= yearAgo;
      default:
        return true;
    }
  };

  const filteredActivities = (activities || []).filter((activity) => {
    // Handle both 'type' and 'action' fields for backward compatibility
    const activityType = activity.type || activity.action;
    const matchesType = filter === "all" || activityType === filter;
    const matchesDate = filterByDateRange(activity);
    return matchesType && matchesDate;
  });

  // Debug logging
  console.log("📊 Activities debug info:", {
    totalActivities: activities?.length || 0,
    filteredActivities: filteredActivities.length,
    currentFilter: filter,
    currentDateRange: dateRange,
    activities: activities,
    isLoading,
    activitiesError,
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative border border-gray-100 animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Item History
            </h2>
            <p className="text-gray-600 mt-1">{item?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadItemHistory}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              aria-label="Refresh"
            >
              <TbRefresh
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <TbX size={24} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <option value="all">All Activities</option>
                <option value="create">Created</option>
                <option value="update">Updated</option>
                <option value="quantity_change">Quantity Changed</option>
                <option value="move">Moved</option>
                <option value="tag_update">Tags Updated</option>
                <option value="delete">Deleted</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Date Range:
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activitiesError ? (
            <div className="text-center py-12">
              <TbHistory size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Error Loading History
              </h3>
              <p className="text-gray-500 mb-4">{activitiesError}</p>
              <button
                onClick={loadItemHistory}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Loading history...</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <TbHistory size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No History Found
              </h3>
              <p className="text-gray-500">
                No activities match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type || activity.action)}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {getActivityDescription(activity)}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center">
                        <TbCalendar className="mr-1" size={14} />
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>

                    {(activity.userId || activity.user) && (
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <TbUser className="mr-1" size={14} />
                        {activity.userId?.name ||
                          activity.user?.name ||
                          activity.userId?.email ||
                          activity.user?.email ||
                          "Unknown User"}
                      </div>
                    )}

                    {activity.details && (
                      <div className="text-sm text-gray-600">
                        {activity.details.reason && (
                          <p>
                            <strong>Reason:</strong> {activity.details.reason}
                          </p>
                        )}
                        {activity.details.notes && (
                          <p>
                            <strong>Notes:</strong> {activity.details.notes}
                          </p>
                        )}
                        {activity.details.oldValue !== undefined && (
                          <p>
                            <strong>Previous Value:</strong>{" "}
                            {activity.details.oldValue}
                          </p>
                        )}
                        {activity.details.newValue !== undefined && (
                          <p>
                            <strong>New Value:</strong>{" "}
                            {activity.details.newValue}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredActivities.length}{" "}
            {filteredActivities.length === 1 ? "activity" : "activities"} found
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemHistoryModal;
