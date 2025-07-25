import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useFolders from "../hooks/useFolders";
import {
  TbEdit,
  TbCopy,
  TbFolderShare,
  TbPlus,
  TbTrash,
  TbLock,
  TbBell,
  TbTag,
  TbDownload,
  TbUser,
  TbCalendar,
  TbFilter,
} from "react-icons/tb";
import toast from "react-hot-toast";

const FolderHistoryModal = ({ open, onClose, folder }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { getFolderHistory } = useFolders();

  const activityTypes = {
    created: {
      icon: <TbPlus className="text-primary" />,
      label: "Created",
      color: "text-primary",
    },
    updated: {
      icon: <TbEdit className="text-primary" />,
      label: "Updated",
      color: "text-primary",
    },
    moved: {
      icon: <TbFolderShare className="text-orange-600" />,
      label: "Moved",
      color: "text-orange-600",
    },
    cloned: {
      icon: <TbCopy className="text-purple-600" />,
      label: "Cloned",
      color: "text-purple-600",
    },
    deleted: {
      icon: <TbTrash className="text-green-600" />,
      label: "Deleted",
      color: "text-green-600",
    },
    permissions_changed: {
      icon: <TbLock className="text-indigo-600" />,
      label: "Permissions Changed",
      color: "text-indigo-600",
    },
    alert_set: {
      icon: <TbBell className="text-yellow-600" />,
      label: "Alert Set",
      color: "text-yellow-600",
    },
    label_added: {
      icon: <TbTag className="text-pink-600" />,
      label: "Label Added",
      color: "text-pink-600",
    },
    exported: {
      icon: <TbDownload className="text-teal-600" />,
      label: "Exported",
      color: "text-teal-600",
    },
  };

  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "created", label: "Created" },
    { value: "updated", label: "Updated" },
    { value: "moved", label: "Moved" },
    { value: "cloned", label: "Cloned" },
    { value: "permissions_changed", label: "Permissions" },
    { value: "alert_set", label: "Alerts" },
    { value: "exported", label: "Exports" },
  ];

  useEffect(() => {
    if (open && folder) {
      loadHistory();
    }
  }, [open, folder, filter]);

  const loadHistory = async (pageNum = 1) => {
    if (!folder) return;

    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 20,
        ...(filter !== "all" && { type: filter }),
      };

      const response = await getFolderHistory(folder._id, params);

      if (pageNum === 1) {
        setHistory(response.activities || []);
      } else {
        setHistory((prev) => [...prev, ...(response.activities || [])]);
      }

      setHasMore(response.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      toast.error("Failed to load folder history");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadHistory(page + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getActivityDescription = (activity) => {
    const { action, details, metadata } = activity;

    switch (action) {
      case "created":
        return "Folder was created";
      case "updated":
        if (details?.fields) {
          const fields = details.fields.join(", ");
          return `Updated ${fields}`;
        }
        return "Folder was updated";
      case "moved":
        const fromFolder = details?.fromFolder || "Root";
        const toFolder = details?.toFolder || "Root";
        return `Moved from "${fromFolder}" to "${toFolder}"`;
      case "cloned":
        return `Cloned to create "${details?.newName || "New Folder"}"`;
      case "permissions_changed":
        return `Permissions updated for ${details?.userCount || 0} user(s)`;
      case "alert_set":
        return `Alert "${details?.alertType || "notification"}" was configured`;
      case "label_added":
        return `Label "${details?.labelName || "New Label"}" was added`;
      case "exported":
        return `Exported as ${details?.format?.toUpperCase() || "file"}`;
      default:
        return `${action.replace("_", " ")} action performed`;
    }
  };

  if (!folder) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`History: ${folder.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <TbFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* History List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading && history.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <TbCalendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No activity history found</p>
              {filter !== "all" && (
                <p className="text-sm text-gray-400 mt-1">
                  Try changing the filter to see more activities
                </p>
              )}
            </div>
          ) : (
            <>
              {history.map((activity, index) => {
                const activityType =
                  activityTypes[activity.action] || activityTypes.updated;

                return (
                  <div
                    key={activity._id || index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  >
                    {/* Activity Icon */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                      {activityType.icon}
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${activityType.color}`}>
                          {activityType.label}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-1">
                        {getActivityDescription(activity)}
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TbUser className="w-3 h-3" />
                        <span>
                          {activity.user?.name || activity.userId || "System"}
                        </span>
                      </div>

                      {/* Additional Details */}
                      {activity.metadata &&
                        Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">
                            {Object.entries(activity.metadata).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="font-medium">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 text-sm text-primary hover:text-primary hover:bg-primary-light rounded-lg transition-colors duration-150 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FolderHistoryModal;
