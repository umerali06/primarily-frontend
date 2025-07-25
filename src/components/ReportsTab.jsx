import React, { useState, useEffect } from "react";
import {
  TbBox,
  TbFolder,
  TbCurrencyDollar,
  TbAlertTriangle,
  TbActivity,
  TbDownload,
  TbRefresh,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-gray-600 text-sm">{title}</div>
  </div>
);

const ItemsTable = ({ items }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Item Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Value
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Folder
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.quantity || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              PKR {(item.price || 0).toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              PKR {((item.quantity || 0) * (item.price || 0)).toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.folderId?.name || "No Folder"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ActivitiesTable = ({ activities }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Item
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {activities.map((activity) => (
          <tr key={activity._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
              {activity.action}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {activity.resourceId?.name ||
                activity.details?.itemName ||
                "Unknown"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(activity.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReportsTab = () => {
  const {
    items = [],
    folders = [],
    activities = [],
    fetchReport,
    reports = {},
    reportsLoading,
    reportsError,
  } = useInventory();

  const [activeReport, setActiveReport] = useState("summary");
  const [reportData, setReportData] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const { fetchItems, fetchFolders, fetchActivities } =
          useInventory.getState();
        await Promise.all([fetchItems(), fetchFolders(), fetchActivities()]);
      } catch (error) {
        console.error("Failed to load reports data:", error);
      }
    };

    loadData();
  }, []);

  // Calculate real statistics from actual data
  const stats = {
    totalItems: Array.isArray(items) ? items.length : 0,
    totalFolders: Array.isArray(folders) ? folders.length : 0,
    totalValue: Array.isArray(items)
      ? items.reduce(
          (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
          0
        )
      : 0,
    lowStockItems: Array.isArray(items)
      ? items.filter((item) => (item.quantity || 0) <= (item.minLevel || 0))
          .length
      : 0,
    recentActivities: Array.isArray(activities) ? activities.length : 0,
  };

  const handleGenerateInventoryReport = async () => {
    setActiveReport("inventory");
    try {
      await fetchReport("inventory-summary");
      setReportData(reports["inventory-summary"]);
    } catch (error) {
      console.error("Failed to generate inventory report:", error);
    }
  };

  const handleGenerateActivityReport = async () => {
    setActiveReport("activity");
    try {
      await fetchReport("activity-history");
      setReportData(reports["activity-history"]);
    } catch (error) {
      console.error("Failed to generate activity report:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory Reports
        </h1>
        <p className="text-gray-600">
          View your inventory statistics and generate detailed reports.
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Items"
          value={stats.totalItems.toLocaleString()}
          icon={<TbBox className="text-blue-600 text-xl" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Folders"
          value={stats.totalFolders.toLocaleString()}
          icon={<TbFolder className="text-green-600 text-xl" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Value"
          value={`PKR ${stats.totalValue.toLocaleString()}`}
          icon={<TbCurrencyDollar className="text-purple-600 text-xl" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems.toLocaleString()}
          icon={<TbAlertTriangle className="text-red-600 text-xl" />}
          color="bg-green-100"
        />
        <StatCard
          title="Recent Activities"
          value={stats.recentActivities.toLocaleString()}
          icon={<TbActivity className="text-orange-600 text-xl" />}
          color="bg-orange-100"
        />
      </div>

      {/* Report Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveReport("summary")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeReport === "summary"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Summary
            </button>
            <button
              onClick={handleGenerateInventoryReport}
              disabled={reportsLoading}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeReport === "inventory"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {reportsLoading && activeReport === "inventory" ? (
                <span className="flex items-center gap-2">
                  <TbRefresh className="animate-spin" />
                  Loading...
                </span>
              ) : (
                "Inventory Report"
              )}
            </button>
            <button
              onClick={handleGenerateActivityReport}
              disabled={reportsLoading}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeReport === "activity"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {reportsLoading && activeReport === "activity" ? (
                <span className="flex items-center gap-2">
                  <TbRefresh className="animate-spin" />
                  Loading...
                </span>
              ) : (
                "Activity Report"
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {activeReport === "summary" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Current Inventory Summary
              </h2>
            </div>

            {items.length > 0 ? (
              <ItemsTable items={items.slice(0, 10)} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TbBox className="text-4xl text-gray-300 mx-auto mb-2" />
                <p>No items in inventory</p>
              </div>
            )}

            {items.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  Showing first 10 items of {items.length} total items
                </p>
              </div>
            )}
          </div>
        )}

        {activeReport === "inventory" && reportData && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Detailed Inventory Report
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <TbDownload />
                Export
              </button>
            </div>

            {reportData.items && reportData.items.length > 0 ? (
              <ItemsTable items={reportData.items} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TbBox className="text-4xl text-gray-300 mx-auto mb-2" />
                <p>No items found</p>
              </div>
            )}
          </div>
        )}

        {activeReport === "activity" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity Report
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <TbDownload />
                Export
              </button>
            </div>

            {activities.length > 0 ? (
              <ActivitiesTable activities={activities.slice(0, 20)} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TbActivity className="text-4xl text-gray-300 mx-auto mb-2" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error State */}
      {reportsError && (
        <div className="bg-green-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-2 text-green-700">
            <TbAlertTriangle />
            <span className="font-medium">Error loading report</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{reportsError}</p>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
