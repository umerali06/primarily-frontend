import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  TbLayoutDashboard,
  TbBox,
  TbSearch,
  TbTags,
  TbGitBranch,
  TbChartBar,
  TbSpeakerphone,
  TbHelpCircle,
  TbEdit,
  TbFolder,
  TbHistory,
  TbTag,
  TbBell,
  TbDownload,
  TbCopy,
  TbKey,
  TbTrash,
  TbDotsVertical,
  TbX,
  TbSettings,
  TbGift,
  TbScan,
} from "react-icons/tb";
import useInventoryStore from "../store/inventoryStore";
import useAuthStore from "../store/authStore";
import { settingsService } from "../services/settings";
import toast from "react-hot-toast";

// Import new components
import ResponsiveSidebar from "../components/ResponsiveSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardLayout from "../components/DashboardLayout";

// Import existing components
import FolderTree from "../components/FolderTree";
import ItemsGrid from "../components/ItemsGrid";
import InfoAlert from "../components/InfoAlert";
import DashboardTab from "../components/DashboardTab";
import ItemsTab from "../components/ItemsTab";
import SearchTab from "../components/SearchTab";
import TagsTab from "../components/TagsTab";
import WorkflowTab from "../components/WorkflowTab";
import ReportsTab from "../components/ReportsTab";
import NewsTab from "../components/NewsTab";
import HelpTab from "../components/HelpTab";
import FolderDetails from "../components/FolderDetails";
import FoldersTab from "../components/FoldersTab";
import OnboardingModal from "../components/OnboardingModal";
import SpotlightTour from "../components/SpotlightTour";
import UltraPlanModal from "../components/UltraPlanModal";
import CreateLabelModal from "../components/CreateLabelModal";
import SetAlertModal from "../components/SetAlertModal";
import ExportModal from "../components/ExportModal";
import CloneModal from "../components/CloneModal";
import PermissionsModal from "../components/PermissionsModal";
import DeleteModal from "../components/DeleteModal";
import ProductsTabModal from "../components/ProductsTabModal";
import NotificationsTab from "../components/NotificationsTab";
import SettingsTab from "../components/SettingsTab";
import SetFolderModal from "../components/SetFolderModal";
import BarcodeSearchModal from "../components/BarcodeSearchModal";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";

const SIDEBAR_TABS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <TbLayoutDashboard size={24} />,
  },
  { key: "items", label: "Items", icon: <TbBox size={24} /> },
  { key: "folders", label: "Folders", icon: <TbFolder size={24} /> },
  { key: "search", label: "Search", icon: <TbSearch size={24} /> },
  { key: "tags", label: "Tags", icon: <TbTags size={24} /> },
  { key: "workflow", label: "Workflow", icon: <TbGitBranch size={24} /> },
  { key: "reports", label: "Reports", icon: <TbChartBar size={24} /> },
  { key: "news", label: "Product News", icon: <TbSpeakerphone size={24} /> },
  { key: "notifications", label: "Notifications", icon: <TbBell size={24} /> },
  { key: "help", label: "Help Centre", icon: <TbHelpCircle size={24} /> },
  { key: "settings", label: "Settings", icon: <TbSettings size={24} /> },
];

const SIDEBAR_ACTIONS = [
  {
    key: "scanner",
    label: "Barcode Scanner",
    icon: <TbScan size={24} />,
    action: "openScanner",
  },
];

const GREEN = {
  main: "var(--primary-color)",
  light: "#D1FAE5",
  dark: "#065F46",
  text: "#065F46",
};

// Remove this function as we'll use the user from auth store directly

const ItemsDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [showStartFresh, setShowStartFresh] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFolderDetails, setSelectedFolderDetails] = useState(null);
  const [showMoveFolder, setShowMoveFolder] = useState(false);
  const [moveFolderTarget, setMoveFolderTarget] = useState(null);
  const [showUltraPlanModal, setShowUltraPlanModal] = useState(false);
  const [showCreateLabelModal, setShowCreateLabelModal] = useState(false);
  const [showSetAlertModal, setShowSetAlertModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductsTabModal, setShowProductsTabModal] = useState(false);
  const [showSetFolderModal, setShowSetFolderModal] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState(["all"]);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  // Store hooks
  const { user } = useAuthStore();
  const {
    items = [],
    folders = [],
    alerts = [],
    fetchItems,
    fetchFolders,
    fetchFolderHierarchy,
    fetchAlerts,
    fetchAlertCount,
  } = useInventoryStore();

  // Barcode scanner
  const { isScanning, scanHistory, openScanner, closeScanner } =
    useBarcodeScanner();

  // Context menu state
  const [openContextMenu, setOpenContextMenu] = useState({
    type: null,
    id: null,
  });
  const handleContextMenuOpen = (type, id) => setOpenContextMenu({ type, id });
  const folderMenuRef = useRef(null);
  const itemMenuRef = useRef(null);

  // Load data on component mount (only when user ID changes, not the whole user object)
  useEffect(() => {
    if (user?.id) {
      fetchItems();
      fetchFolders();
      fetchFolderHierarchy();
      fetchAlerts();
      fetchAlertCount();
    }
  }, [user?.id]);

  // Load user settings separately to avoid triggering data refresh
  useEffect(() => {
    if (user?.id) {
      const loadUserSettings = async () => {
        try {
          const response = await settingsService.getUserSettings();
          const settings = response.data.settings || {};

          // Update user with display name from settings if available
          if (settings.profile?.displayName) {
            useAuthStore.getState().updateUser({
              displayName: settings.profile.displayName,
            });
          }
        } catch (error) {
          // Don't show error to user, just use default name
          console.log("Could not load user settings for display name:", error);
        }
      };

      loadUserSettings();
    }
  }, [user?.id]); // Only run when user ID changes, not when user object updates

  // Filter items by selected folder
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return selectedFolder === "all"
      ? items.filter((item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase())
        )
      : items.filter(
          (item) =>
            item?.folderId === selectedFolder &&
            item?.name?.toLowerCase().includes(search.toLowerCase())
        );
  }, [items, selectedFolder, search]);

  // Handlers
  const handleFolderHistory = (folder) => {
    setActiveTab("reports");
    setSelectedFolderDetails(null);
  };

  const handleCreateLabel = () => setShowCreateLabelModal(true);
  const handleSetAlert = () => setShowSetAlertModal(true);
  const handleExport = () => setShowExportModal(true);
  const handleClone = () => setShowCloneModal(true);
  const handlePermissions = () => setShowPermissionsModal(true);
  const handleDelete = () => setShowDeleteModal(true);

  const handleOpenScanner = () => setShowBarcodeModal(true);
  const handleCloseBarcodeModal = () => {
    setShowBarcodeModal(false);
    closeScanner();
  };

  const handleItemFound = (item) => {
    setActiveTab("items");
    setSelectedFolder(item.folderId || "all");
    toast.success(`Found item: ${item.name}`);
    handleCloseBarcodeModal();
  };

  const handleCreateItemFromBarcode = (barcode) => {
    setActiveTab("items");
    toast.info(`Creating new item with barcode: ${barcode}`);
    handleCloseBarcodeModal();
  };

  const handleItemSelect = (item) => {
    setActiveTab("items");
    setSelectedFolder(item.folderId || "all");
    toast.success(`Selected item: ${item.name}`);
    handleCloseBarcodeModal();
  };

  const handleMoveFolder = (folder) => {
    setMoveFolderTarget(folder);
    setShowMoveFolder(true);
    setOpenContextMenu({ type: null, id: null });
  };

  const handleTabChange = (tabKey) => {
    if (tabKey === "reports") {
      setActiveTab("reports");
      setSelectedFolderDetails(null);
    } else if (tabKey === "news") {
      setShowProductsTabModal(true);
    } else if (tabKey === "help") {
      window.open("https://help.primarily.com/hc/en-us", "_blank");
    } else {
      setActiveTab(tabKey);
      setSelectedFolderDetails(null);
    }
  };

  const handleActionClick = (action) => {
    if (action.action === "openScanner") {
      handleOpenScanner();
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-4 lg:p-6">
            <DashboardTab
              onSetFoldersClick={() => setShowSetFolderModal(true)}
            />
            <SetFolderModal
              open={showSetFolderModal}
              onClose={() => setShowSetFolderModal(false)}
              onApply={(folders) => {
                setSelectedFolders(folders);
                setShowSetFolderModal(false);
              }}
              selected={selectedFolders}
              setSelected={setSelectedFolders}
            />
          </div>
        );
      case "items":
        return (
          <div className="h-full">
            <ItemsTab
              folders={folders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              openContextMenu={openContextMenu}
              handleContextMenuOpen={handleContextMenuOpen}
              folderMenuRef={folderMenuRef}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              search={search}
              setSearch={setSearch}
              showStartFresh={showStartFresh}
              setShowStartFresh={setShowStartFresh}
              GREEN={GREEN}
              filteredItems={filteredItems}
              itemMenuRef={itemMenuRef}
              onMove={handleMoveFolder}
              onHistory={handleFolderHistory}
              onCreateLabel={handleCreateLabel}
              onSetAlert={handleSetAlert}
              onExport={handleExport}
              onClone={handleClone}
              onPermissions={handlePermissions}
              onDelete={handleDelete}
              onOpenBarcodeScanner={handleOpenScanner}
            />
          </div>
        );
      case "folders":
        return (
          <div className="p-4 lg:p-6">
            <FoldersTab GREEN={GREEN} />
          </div>
        );
      case "search":
        return (
          <div className="p-4 lg:p-6">
            <SearchTab GREEN={GREEN} />
          </div>
        );
      case "tags":
        return (
          <div className="p-4 lg:p-6">
            <TagsTab GREEN={GREEN} />
          </div>
        );
      case "workflow":
        return (
          <div className="p-4 lg:p-6">
            <WorkflowTab GREEN={GREEN} />
          </div>
        );
      case "reports":
        return (
          <div className="p-4 lg:p-6">
            <ReportsTab />
          </div>
        );
      case "news":
        return (
          <div className="p-4 lg:p-6">
            <NewsTab GREEN={GREEN} />
          </div>
        );
      case "notifications":
        return (
          <div className="p-4 lg:p-6">
            <NotificationsTab GREEN={GREEN} />
          </div>
        );
      case "help":
        return (
          <div className="p-4 lg:p-6">
            <HelpTab GREEN={GREEN} />
          </div>
        );
      case "settings":
        return (
          <div className="p-4 lg:p-6">
            <SettingsTab />
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to get the current tab label
  const getTabLabel = (key) => {
    const tab = SIDEBAR_TABS.find((t) => t.key === key);
    return tab ? tab.label : "";
  };

  // Create sidebar and navbar components
  const sidebar = (
    <ResponsiveSidebar
      tabs={SIDEBAR_TABS}
      actions={SIDEBAR_ACTIONS}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onActionClick={handleActionClick}
      isScanning={isScanning}
      scanHistory={scanHistory}
    />
  );

  const navbar = (
    <DashboardNavbar
      title={getTabLabel(activeTab)}
      user={user}
      onProfileClick={() => setActiveTab("settings")}
      onNotificationsClick={() => setActiveTab("notifications")}
      notificationCount={alerts?.length || 0}
    />
  );

  return (
    <>
      <DashboardLayout
        sidebar={sidebar}
        navbar={navbar}
        className="main-content"
      >
        {selectedFolderDetails ? (
          <div className="p-4 lg:p-6">
            <FolderDetails
              folders={folders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              openContextMenu={openContextMenu}
              handleContextMenuOpen={handleContextMenuOpen}
              folderMenuRef={folderMenuRef}
              setShowHistory={setShowHistory}
              selectedFolderDetails={selectedFolderDetails}
              setSelectedFolderDetails={setSelectedFolderDetails}
              setActiveTab={setActiveTab}
              setOpenContextMenu={setOpenContextMenu}
              onHistory={handleFolderHistory}
              onCreateLabel={handleCreateLabel}
              onSetAlert={handleSetAlert}
              onExport={handleExport}
              onClone={handleClone}
              onPermissions={handlePermissions}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          renderTabContent()
        )}
      </DashboardLayout>

      {/* Barcode Scanner Modal */}
      <BarcodeSearchModal
        isOpen={showBarcodeModal}
        onClose={handleCloseBarcodeModal}
        onItemFound={handleItemFound}
        onCreateItem={handleCreateItemFromBarcode}
        onItemSelect={handleItemSelect}
      />

      {/* Other Modals */}
      <CreateLabelModal
        open={showCreateLabelModal}
        onClose={() => setShowCreateLabelModal(false)}
        onCreate={() => setShowCreateLabelModal(false)}
      />
      <SetAlertModal
        open={showSetAlertModal}
        onClose={() => setShowSetAlertModal(false)}
        onViewPlans={() => setShowSetAlertModal(false)}
      />
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onNext={() => setShowExportModal(false)}
      />
      <CloneModal
        open={showCloneModal}
        onClose={() => setShowCloneModal(false)}
        onClone={() => setShowCloneModal(false)}
      />
      <PermissionsModal
        open={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
      />
      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => setShowDeleteModal(false)}
        itemType="folder"
        quantity={1}
      />
      <ProductsTabModal
        open={showProductsTabModal}
        onClose={() => setShowProductsTabModal(false)}
      />
      <SetFolderModal
        open={showSetFolderModal}
        onClose={() => setShowSetFolderModal(false)}
        onApply={(folders) => {
          setSelectedFolders(folders);
          setShowSetFolderModal(false);
        }}
        selected={selectedFolders}
        setSelected={setSelectedFolders}
      />
    </>
  );
};

export default ItemsDashboardPage;
