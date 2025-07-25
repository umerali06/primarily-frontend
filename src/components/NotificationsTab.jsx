import React, { useState, useEffect } from "react";
import {
  TbBell,
  TbBellOff,
  TbCheck,
  TbX,
  TbTrash,
  TbSettings,
  TbFilter,
  TbAlertTriangle,
  TbInfoCircle,
  TbCircleCheck,
  TbRefresh,
  TbMenu,
  TbEye,
  TbEyeOff,
  TbVolume,
  TbVolumeOff,
  TbPlus,
  TbExternalLink,
  TbClock,
  TbStar,
  TbStarFilled,
} from "react-icons/tb";
import useNotifications from "../hooks/useNotifications";
import toast from "react-hot-toast";

const NotificationsTab = () => {
  const [filter, setFilter] = useState("all"); // all, unread, alerts, system, high_priority
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    enableRealTime: true,
    enableBrowserNotifications: true,
    enableSounds: false,
    autoMarkAsRead: false,
    pollingFrequency: 30000
  });

  // Use the enhanced notification hook
  const {
    notifications,
    counts,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    dismissNotification,
    createNotification,
    refresh,
    getUnreadCount,
    hasUnread,
    getNotificationsByType,
    getNotificationsByPriority,
  } = useNotifications(notificationSettings);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setNotificationSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.success('Notification settings saved');
  };

  const getNotificationType = (alertType) => {
    switch (alertType) {
      case "low_quantity":
      case "out_of_stock":
        return "warning";
      case "item_created":
      case "item_updated":
      case "folder_created":
      case "folder_updated":
        return "info";
      case "item_deleted":
      case "folder_deleted":
        return "error";
      case "system":
        return "system";
      case "bulk_operation":
        return "info";
      case "custom":
        return "info";
      case "expiration":
        return "warning";
      default:
        return "info";
    }
  };

  const getNotificationIcon = (type, priority) => {
    const iconProps = { size: 20 };
    
    switch (type) {
      case "warning":
        return <TbAlertTriangle className="text-yellow-600" {...iconProps} />;
      case "error":
        return <TbX className="text-red-600" {...iconProps} />;
      case "info":
        return <TbInfoCircle className="text-blue-600" {...iconProps} />;
      case "success":
        return <TbCircleCheck className="text-green-600" {...iconProps} />;
      case "system":
        return <TbSettings className="text-gray-600" {...iconProps} />;
      default:
        return <TbBell className="text-gray-600" {...iconProps} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <TbAlertTriangle className="text-red-600" size={16} />;
      case 'high':
        return <TbStarFilled className="text-orange-600" size={16} />;
      case 'medium':
        return <TbStar className="text-blue-600" size={16} />;
      case 'low':
        return <TbInfoCircle className="text-green-600" size={16} />;
      default:
        return <TbInfoCircle className="text-gray-600" size={16} />;
    }
  };

  const bulkAction = async (action) => {
    if (selectedNotifications.length === 0) {
      toast.error("Please select notifications first");
      return;
    }

    try {
      let successCount = 0;
      
      for (const id of selectedNotifications) {
        let success = false;
        
        switch (action) {
          case "read":
            success = await markAsRead(id);
            break;
          case "delete":
            success = await deleteNotification(id);
            break;
          case "dismiss":
            success = await dismissNotification(id);
            break;
        }
        
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} notifications ${action === 'read' ? 'marked as read' : action + 'd'}`);
      }
      
      setSelectedNotifications([]);
    } catch (error) {
      toast.error(`Failed to ${action} notifications`);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return notif.status === "active";
      case "alerts":
        return ["warning", "error"].includes(getNotificationType(notif.type));
      case "system":
        return notif.type === "system";
      case "high_priority":
        return ["high", "critical"].includes(notif.priority);
      default:
        return true;
    }
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (notification.status === "active") {
      markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col p-4 lg:p-6 transition-transform duration-300 ease-in-out h-full lg:h-auto`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <TbX size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <TbBell size={24} className="text-gray-700" />
            {hasUnread() && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
        </div>

        {/* Real-time Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${notificationSettings.enableRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {notificationSettings.enableRealTime ? 'Live Updates' : 'Manual Refresh'}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <TbSettings size={16} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">Notification Settings</h3>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Real-time Updates</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.enableRealTime}
                  onChange={(e) => saveSettings({
                    ...notificationSettings,
                    enableRealTime: e.target.checked
                  })}
                  className="text-blue-600"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Browser Notifications</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.enableBrowserNotifications}
                  onChange={(e) => saveSettings({
                    ...notificationSettings,
                    enableBrowserNotifications: e.target.checked
                  })}
                  className="text-blue-600"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Sound Alerts</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.enableSounds}
                  onChange={(e) => saveSettings({
                    ...notificationSettings,
                    enableSounds: e.target.checked
                  })}
                  className="text-blue-600"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Auto Mark Read</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.autoMarkAsRead}
                  onChange={(e) => saveSettings({
                    ...notificationSettings,
                    autoMarkAsRead: e.target.checked
                  })}
                  className="text-blue-600"
                />
              </label>
            </div>
          </div>
        )}

        {/* Filter Options */}
        <nav className="space-y-2 mb-6">
          {[
            {
              key: "all",
              label: "All Notifications",
              count: counts.total,
              icon: <TbBell size={16} />
            },
            {
              key: "unread",
              label: "Unread",
              count: counts.active,
              icon: <TbEye size={16} />
            },
            {
              key: "high_priority",
              label: "High Priority",
              count: getNotificationsByPriority('high').length + getNotificationsByPriority('critical').length,
              icon: <TbStarFilled size={16} />
            },
            {
              key: "alerts",
              label: "Stock Alerts",
              count: getNotificationsByType('low_quantity').length + getNotificationsByType('out_of_stock').length,
              icon: <TbAlertTriangle size={16} />
            },
            {
              key: "system",
              label: "System",
              count: getNotificationsByType('system').length,
              icon: <TbSettings size={16} />
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setFilter(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                filter === item.key
                  ? "bg-[#e6f3f1] text-[#0a7662] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : item.count > 0 ? (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    filter === item.key
                      ? "bg-[#0a7662] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={markAllAsRead}
            className="w-full px-3 py-2 text-sm text-[#0a7662] hover:bg-[#e6f3f1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasUnread() || loading}
          >
            Mark All as Read
          </button>

          <button
            onClick={() => setShowCreateAlert(true)}
            className="w-full px-3 py-2 text-sm text-[#0a7662] hover:bg-[#e6f3f1] rounded-lg transition-colors flex items-center gap-2"
          >
            <TbPlus size={16} />
            Create Custom Alert
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-4 text-gray-600 hover:text-gray-800 self-start"
        >
          <TbMenu size={24} />
        </button>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                {filter === "all"
                  ? "All Notifications"
                  : filter === "unread"
                  ? "Unread Notifications"
                  : filter === "alerts"
                  ? "Stock Alerts"
                  : filter === "high_priority"
                  ? "High Priority Notifications"
                  : "System Notifications"}
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                {filteredNotifications.length} notifications
                {error && (
                  <span className="text-orange-600 ml-2">
                    (Limited functionality - API issues)
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-[#0a7662] hover:bg-[#e6f3f1] rounded-lg transition-colors disabled:opacity-50"
                title="Refresh notifications"
              >
                <TbRefresh
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              {/* Bulk Actions */}
              {selectedNotifications.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={() => bulkAction("read")}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => bulkAction("dismiss")}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => bulkAction("delete")}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {error && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <TbAlertTriangle className="text-yellow-600 mr-2" size={20} />
                <div>
                  <h4 className="text-yellow-800 font-medium">Limited Functionality</h4>
                  <p className="text-yellow-700 text-sm">
                    Some notification features may not work properly due to API connectivity issues.
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <TbBellOff size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Notifications
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : filter === "high_priority"
                  ? "No high priority notifications at the moment."
                  : "You don't have any notifications yet."}
              </p>
              {!loading && (
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-[#0a7662] text-white rounded-lg hover:bg-[#075c4c] transition-colors"
                >
                  Refresh Notifications
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border rounded-lg p-3 lg:p-4 transition-all cursor-pointer hover:shadow-md ${
                    notification.status === "active"
                      ? "bg-[#e6f3f1] border-[#0a7662] border-l-4"
                      : "bg-white border-gray-200"
                  } ${
                    selectedNotifications.includes(notification._id)
                      ? "ring-2 ring-blue-500 ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2 lg:gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedNotifications((prev) => [
                            ...prev,
                            notification._id,
                          ]);
                        } else {
                          setSelectedNotifications((prev) =>
                            prev.filter((id) => id !== notification._id)
                          );
                        }
                      }}
                      className="mt-1 text-[#0a7662] focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                    />

                    {/* Notification Icon */}
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getNotificationIcon(getNotificationType(notification.type), notification.priority)}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-2 gap-1 lg:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-medium text-sm lg:text-base ${
                                notification.status === "active"
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {notification.priority && (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}>
                                {getPriorityIcon(notification.priority)}
                                {notification.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          <p
                            className={`text-sm ${
                              notification.status === "active" ? "text-gray-700" : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <TbClock size={14} />
                          <span>{formatTimestamp(notification.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && notification.actionText && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.actionUrl;
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#0a7662] text-white rounded-md hover:bg-[#075c4c] transition-colors"
                          >
                            {notification.actionText}
                            <TbExternalLink size={12} />
                          </button>
                        </div>
                      )}

                      {/* Metadata */}
                      {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {notification.metadata.itemName && (
                            <span className="inline-block mr-3">Item: {notification.metadata.itemName}</span>
                          )}
                          {notification.metadata.operation && (
                            <span className="inline-block mr-3">Operation: {notification.metadata.operation}</span>
                          )}
                          {notification.metadata.count && (
                            <span className="inline-block mr-3">Count: {notification.metadata.count}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 lg:gap-2">
                      {notification.status === "active" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="p-1 text-gray-400 hover:text-[#0a7662] transition-colors"
                          title="Mark as read"
                        >
                          <TbCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification._id);
                        }}
                        className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Dismiss notification"
                      >
                        <TbEyeOff size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <TbTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Custom Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create Custom Alert</h2>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <TbX size={24} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const alertData = {
                  title: formData.get('title'),
                  message: formData.get('message'),
                  priority: formData.get('priority'),
                  type: 'custom'
                };

                const result = await createNotification(alertData);
                if (result) {
                  setShowCreateAlert(false);
                  e.target.reset();
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                  placeholder="Enter alert title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                  placeholder="Enter alert message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAlert(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a7662] text-white rounded-lg hover:bg-[#075c4c]"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
