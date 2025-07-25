import React, { useState, useEffect } from "react";
import {
  TbBox,
  TbFolder,
  TbTag,
  TbAlertTriangle,
  TbTrendingUp,
  TbTrendingDown,
  TbCurrencyDollar,
  TbClock,
  TbEye,
  TbEyeOff,
  TbBell,
  TbChartBar,
  TbSettings,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import useAuthStore from "../store/authStore";

const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm ${
            trend === "up" ? "text-primary" : "text-green-600"
          }`}
        >
          {trend === "up" ? <TbTrendingUp /> : <TbTrendingDown />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-gray-600 text-sm">{title}</div>
  </div>
);

const AlertCard = ({ alert, onDismiss }) => (
  <div className="bg-white rounded-lg border border-red-200 p-4 mb-3">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <TbAlertTriangle className="text-red-500 text-xl mt-0.5" />
        <div>
          <div className="font-medium text-gray-900">{alert.title}</div>
          <div className="text-sm text-gray-600">{alert.message}</div>
          <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
        </div>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        ×
      </button>
    </div>
  </div>
);

const RecentActivityItem = ({ activity }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
      <TbBox className="text-primary text-sm" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
      <div className="text-xs text-gray-600">{activity.item}</div>
    </div>
    <div className="text-xs text-gray-400">{activity.time}</div>
  </div>
);

const DashboardTab = ({ onSetFoldersClick }) => {
  const { user } = useAuthStore();
  const {
    items = [],
    folders = [],
    alerts = [],
    alertCount = { active: 0, read: 0, resolved: 0, total: 0 },
    activities = [],
    fetchItems,
    fetchFolders,
    fetchAlerts,
    fetchAlertCount,
    fetchActivities,
    updateAlertStatus,
  } = useInventory();

  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    totalFolders: 0,
    totalValue: 0,
    lowStockItems: 0,
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          fetchItems(),
          fetchFolders(),
          fetchAlerts({ limit: 5 }),
          fetchAlertCount(),
          fetchActivities({ limit: 10 }),
        ]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]); // Only depend on user, not the fetch functions

  // Calculate dashboard statistics
  useEffect(() => {
    if (items && folders) {
      const totalValue = items.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
        0
      );

      const lowStockItems = Array.isArray(items)
        ? items.filter((item) => item.quantity <= item.minLevel).length
        : 0;

      setDashboardStats({
        totalItems: Array.isArray(items) ? items.length : 0,
        totalFolders: Array.isArray(folders) ? folders.length : 0,
        totalValue,
        lowStockItems,
      });
    }
  }, [items, folders]);

  // Process alerts for display
  useEffect(() => {
    if (Array.isArray(alerts) && alerts.length > 0) {
      const processedAlerts = alerts.slice(0, 5).map((alert) => ({
        id: alert._id,
        title: `Low Stock Alert`,
        message: `${alert.itemName || "Item"} is running low (${
          alert.currentValue
        } remaining)`,
        time: new Date(alert.createdAt).toLocaleDateString(),
        status: alert.status,
      }));
      setRecentAlerts(processedAlerts);
    }
  }, [alerts]);

  // Process activities for display
  useEffect(() => {
    if (Array.isArray(activities) && activities.length > 0) {
      const processedActivities = activities.slice(0, 10).map((activity) => ({
        id: activity._id,
        action:
          activity.action.charAt(0).toUpperCase() + activity.action.slice(1),
        item: activity.resourceId?.name || "Unknown item",
        time: new Date(activity.createdAt).toLocaleDateString(),
      }));
      setRecentActivities(processedActivities);
    }
  }, [activities]);

  const handleDismissAlert = async (alertId) => {
    try {
      await updateAlertStatus(alertId, "read");
      setRecentAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    } catch (error) {
      console.error("Failed to dismiss alert:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Items"
          value={dashboardStats.totalItems.toLocaleString()}
          icon={<TbBox className="text-primary text-xl" />}
          color="bg-primary-light"
        />
        <StatCard
          title="Total Folders"
          value={dashboardStats.totalFolders.toLocaleString()}
          icon={<TbFolder className="text-primary text-xl" />}
          color="bg-primary-light"
        />
        <StatCard
          title="Total Value"
          value={`PKR ${dashboardStats.totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={<TbCurrencyDollar className="text-purple-600 text-xl" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Low Stock Items"
          value={dashboardStats.lowStockItems.toLocaleString()}
          icon={<TbAlertTriangle className="text-red-600 text-xl" />}
          color="bg-green-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TbBell className="text-green-500" />
                  Recent Alerts
                </h2>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  {alertCount.active || 0} Active
                </span>
              </div>
            </div>
            <div className="p-6">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TbBell className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p>No recent alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onDismiss={handleDismissAlert}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TbChartBar className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivities.map((activity) => (
                    <RecentActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onSetFoldersClick}
              className="flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors"
            >
              <TbSettings className="text-lg" />
              Configure Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors">
              <TbBox className="text-lg" />
              Add Item
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <TbFolder className="text-lg" />
              Add Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
