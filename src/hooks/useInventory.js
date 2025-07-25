import { useEffect, useCallback } from "react";
import useInventoryStore from "../store/inventoryStore";
import useAuthStore from "../store/authStore";

export const useInventory = () => {
  const { user } = useAuthStore();
  const {
    items,
    folders,
    folderHierarchy,
    alerts,
    alertCount,
    tags,
    activities,
    reports,
    itemsLoading,
    foldersLoading,
    alertsLoading,
    tagsLoading,
    activitiesLoading,
    reportsLoading,
    itemsError,
    foldersError,
    alertsError,
    tagsError,
    activitiesError,
    reportsError,
    fetchItems,
    fetchFolders,
    fetchFolderHierarchy,
    fetchAlerts,
    fetchAlertCount,
    fetchTags,
    fetchActivities,
    fetchItemActivities,
    fetchFolderActivities,
    fetchReport,
    createItem,
    updateItem,
    deleteItem,
    createFolder,
    updateFolder,
    deleteFolder,
    createTag,
    updateTag,
    deleteTag,
    getItemsByTag,
    updateAlertStatus,
    markAllAlertsAsRead,
    searchItems,
    exportReport,
    setFilters,
    setSorting,
    setPagination,
    clearFilters,
    clearErrors,
    bulkUpdateItems,
    bulkDeleteItems,
  } = useInventoryStore();

  // Memoize fetch functions to prevent unnecessary re-renders
  const memoizedFetchItems = useCallback(fetchItems, [fetchItems]);
  const memoizedFetchFolders = useCallback(fetchFolders, [fetchFolders]);
  const memoizedFetchFolderHierarchy = useCallback(fetchFolderHierarchy, [
    fetchFolderHierarchy,
  ]);
  const memoizedFetchAlerts = useCallback(fetchAlerts, [fetchAlerts]);
  const memoizedFetchAlertCount = useCallback(fetchAlertCount, [
    fetchAlertCount,
  ]);
  const memoizedFetchTags = useCallback(fetchTags, [fetchTags]);

  // Load initial data when user is available
  useEffect(() => {
    if (user && user._id) {
      console.log("🔄 Loading initial data for user:", user._id);
      memoizedFetchItems();
      memoizedFetchFolders();
      memoizedFetchFolderHierarchy();
      memoizedFetchAlerts();
      memoizedFetchAlertCount();
      memoizedFetchTags();
    }
  }, [
    user?._id,
    memoizedFetchItems,
    memoizedFetchFolders,
    memoizedFetchFolderHierarchy,
    memoizedFetchAlerts,
    memoizedFetchAlertCount,
    memoizedFetchTags,
  ]);

  return {
    // Data
    items,
    folders,
    folderHierarchy,
    alerts,
    alertCount,
    tags,
    activities,
    reports,

    // Loading states
    itemsLoading,
    foldersLoading,
    alertsLoading,
    tagsLoading,
    activitiesLoading,
    reportsLoading,

    // Error states
    itemsError,
    foldersError,
    alertsError,
    tagsError,
    activitiesError,
    reportsError,

    // Actions
    fetchItems,
    fetchFolders,
    fetchFolderHierarchy,
    fetchAlerts,
    fetchAlertCount,
    fetchTags,
    fetchActivities,
    fetchItemActivities,
    fetchFolderActivities,
    fetchReport,
    createItem,
    updateItem,
    deleteItem,
    createFolder,
    updateFolder,
    deleteFolder,
    createTag,
    updateTag,
    deleteTag,
    getItemsByTag,
    updateAlertStatus,
    markAllAlertsAsRead,
    searchItems,
    exportReport,
    setFilters,
    setSorting,
    setPagination,
    clearFilters,
    clearErrors,

    // Bulk operations
    bulkUpdateItems,
    bulkDeleteItems,
  };
};

export default useInventory;
