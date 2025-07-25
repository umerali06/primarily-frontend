import React, { useState, useEffect } from "react";
import {
  TbUser,
  TbSettings,
  TbBell,
  TbShield,
  TbEye,
  TbGlobe,
  TbKey,
  TbRefresh,
  TbLoader,
  TbLogout,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { settingsService } from "../services/settings";
import toast from "react-hot-toast";

const SETTINGS_TABS = [
  {
    key: "profile",
    label: "Profile",
    icon: <TbUser size={20} />,
  },
  {
    key: "preferences",
    label: "Preferences",
    icon: <TbSettings size={20} />,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <TbBell size={20} />,
  },
  {
    key: "privacy",
    label: "Privacy",
    icon: <TbEye size={20} />,
  },
  {
    key: "security",
    label: "Security",
    icon: <TbShield size={20} />,
  },
  {
    key: "integrations",
    label: "Integrations",
    icon: <TbGlobe size={20} />,
  },
];

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await settingsService.getUserSettings();
      setSettings(response.data.settings || {});
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Local state for form inputs
  const [localSettings, setLocalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when server settings change
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  // Update local state and mark as changed
  const updateLocalSetting = (section, field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save settings to server
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateUserSettings(localSettings);
      setSettings(localSettings);
      setHasChanges(false);

      // Update user in auth store if profile settings changed
      if (localSettings.profile?.displayName) {
        useAuthStore.getState().updateUser({
          displayName: localSettings.profile.displayName,
        });
      }

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset local changes
  const resetChanges = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  // Update setting function for non-profile settings
  const updateSetting = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSaving(true);
    try {
      await settingsService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all settings to defaults?"
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await settingsService.resetSettings();
      setSettings(response.data.settings || {});
      toast.success("Settings reset to defaults");
    } catch (error) {
      console.error("Failed to reset settings:", error);
      toast.error("Failed to reset settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Profile Settings
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={localSettings.profile?.displayName || user?.displayName || user?.name || ""}
            onChange={(e) =>
              updateLocalSetting("profile", "displayName", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
            placeholder="Enter your display name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={localSettings.profile?.timezone || "UTC"}
            onChange={(e) =>
              updateLocalSetting("profile", "timezone", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Karachi">Pakistan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={localSettings.profile?.language || "en"}
            onChange={(e) =>
              updateLocalSetting("profile", "language", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={localSettings.profile?.dateFormat || "MM/DD/YYYY"}
            onChange={(e) =>
              updateLocalSetting("profile", "dateFormat", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={localSettings.profile?.bio || ""}
          onChange={(e) => updateLocalSetting("profile", "bio", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
      </div>
    </div>
  );

  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Preferences
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default View
          </label>
          <select
            value={localSettings.preferences?.defaultView || "grid"}
            onChange={(e) =>
              updateLocalSetting("preferences", "defaultView", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="table">Table View</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items Per Page
          </label>
          <select
            value={localSettings.preferences?.itemsPerPage || 20}
            onChange={(e) =>
              updateLocalSetting(
                "preferences",
                "itemsPerPage",
                parseInt(e.target.value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={localSettings.preferences?.theme || "light"}
            onChange={(e) =>
              updateLocalSetting("preferences", "theme", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Sort By
          </label>
          <select
            value={localSettings.preferences?.defaultSortBy || "createdAt"}
            onChange={(e) =>
              updateLocalSetting("preferences", "defaultSortBy", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="name">Name</option>
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Auto Save</h3>
            <p className="text-sm text-gray-500">Automatically save changes</p>
          </div>
          <button
            onClick={() =>
              updateLocalSetting(
                "preferences",
                "autoSave",
                !localSettings.preferences?.autoSave
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.preferences?.autoSave
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.preferences?.autoSave
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Compact Mode</h3>
            <p className="text-sm text-gray-500">Use compact interface</p>
          </div>
          <button
            onClick={() =>
              updateLocalSetting(
                "preferences",
                "compactMode",
                !localSettings.preferences?.compactMode
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.preferences?.compactMode
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.preferences?.compactMode
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Show Tutorials
            </h3>
            <p className="text-sm text-gray-500">Display helpful tutorials</p>
          </div>
          <button
            onClick={() =>
              updateLocalSetting(
                "preferences",
                "showTutorials",
                !localSettings.preferences?.showTutorials
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.preferences?.showTutorials
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.preferences?.showTutorials
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Notification Settings
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Enabled
                </h4>
                <p className="text-sm text-gray-500">
                  Receive email notifications
                </p>
              </div>
              <button
                onClick={() =>
                  updateLocalSetting("notifications", "email", {
                    ...localSettings.notifications?.email,
                    enabled: !localSettings.notifications?.email?.enabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications?.email?.enabled
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications?.email?.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Low Stock Alerts
                </h4>
                <p className="text-sm text-gray-500">
                  Get notified when items are low in stock
                </p>
              </div>
              <button
                onClick={() =>
                  updateLocalSetting("notifications", "email", {
                    ...localSettings.notifications?.email,
                    lowStock: !localSettings.notifications?.email?.lowStock,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications?.email?.lowStock
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications?.email?.lowStock
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  System Updates
                </h4>
                <p className="text-sm text-gray-500">
                  Get notified about system updates
                </p>
              </div>
              <button
                onClick={() =>
                  updateLocalSetting("notifications", "email", {
                    ...localSettings.notifications?.email,
                    updates: !localSettings.notifications?.email?.updates,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications?.email?.updates
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications?.email?.updates
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            In-App Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  In-App Enabled
                </h4>
                <p className="text-sm text-gray-500">
                  Show notifications in the app
                </p>
              </div>
              <button
                onClick={() =>
                  updateLocalSetting("notifications", "inApp", {
                    ...localSettings.notifications?.inApp,
                    enabled: !localSettings.notifications?.inApp?.enabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications?.inApp?.enabled
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications?.inApp?.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Low Stock Alerts
                </h4>
                <p className="text-sm text-gray-500">
                  Show low stock notifications
                </p>
              </div>
              <button
                onClick={() =>
                  updateLocalSetting("notifications", "inApp", {
                    ...localSettings.notifications?.inApp,
                    lowStock: !localSettings.notifications?.inApp?.lowStock,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications?.inApp?.lowStock
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications?.inApp?.lowStock
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Privacy Settings
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={localSettings.privacy?.profileVisibility || "private"}
            onChange={(e) =>
              updateLocalSetting("privacy", "profileVisibility", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="team">Team Only</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Data Sharing
              </h3>
              <p className="text-sm text-gray-500">
                Allow sharing of anonymized data
              </p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting(
                  "privacy",
                  "dataSharing",
                  !localSettings.privacy?.dataSharing
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.privacy?.dataSharing
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.privacy?.dataSharing
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-500">
                Help improve the app with usage analytics
              </p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting(
                  "privacy",
                  "analytics",
                  !localSettings.privacy?.analytics
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.privacy?.analytics ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.privacy?.analytics
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Crash Reports
              </h3>
              <p className="text-sm text-gray-500">
                Send crash reports to help fix issues
              </p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting(
                  "privacy",
                  "crashReports",
                  !localSettings.privacy?.crashReports
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.privacy?.crashReports
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.privacy?.crashReports
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Security Settings
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security
            </p>
          </div>
          <button
            onClick={() =>
              updateLocalSetting(
                "security",
                "twoFactorEnabled",
                !localSettings.security?.twoFactorEnabled
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.security?.twoFactorEnabled
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.security?.twoFactorEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (hours)
          </label>
          <select
            value={localSettings.security?.sessionTimeout || 24}
            onChange={(e) =>
              updateLocalSetting(
                "security",
                "sessionTimeout",
                parseInt(e.target.value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value={1}>1 hour</option>
            <option value={4}>4 hours</option>
            <option value={8}>8 hours</option>
            <option value={24}>24 hours</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Login Notifications
            </h3>
            <p className="text-sm text-gray-500">Get notified of new logins</p>
          </div>
          <button
            onClick={() =>
              updateLocalSetting(
                "security",
                "loginNotifications",
                !localSettings.security?.loginNotifications
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.security?.loginNotifications
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.security?.loginNotifications
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                <TbKey size={16} />
              )}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Integrations
        </h2>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetChanges}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <TbLoader className="animate-spin" size={16} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Google Drive
              </h3>
              <p className="text-sm text-gray-500">
                Sync files with Google Drive
              </p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting("integrations", "googleDrive", {
                  ...localSettings.integrations?.googleDrive,
                  enabled: !localSettings.integrations?.googleDrive?.enabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.integrations?.googleDrive?.enabled
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.integrations?.googleDrive?.enabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {localSettings.integrations?.googleDrive?.enabled && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder ID
              </label>
              <input
                type="text"
                value={localSettings.integrations?.googleDrive?.folderId || ""}
                onChange={(e) =>
                  updateLocalSetting("integrations", "googleDrive", {
                    ...localSettings.integrations?.googleDrive,
                    folderId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                placeholder="Enter Google Drive folder ID"
              />
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Dropbox</h3>
              <p className="text-sm text-gray-500">Sync files with Dropbox</p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting("integrations", "dropbox", {
                  ...localSettings.integrations?.dropbox,
                  enabled: !localSettings.integrations?.dropbox?.enabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.integrations?.dropbox?.enabled
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.integrations?.dropbox?.enabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {localSettings.integrations?.dropbox?.enabled && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token
              </label>
              <input
                type="password"
                value={localSettings.integrations?.dropbox?.accessToken || ""}
                onChange={(e) =>
                  updateLocalSetting("integrations", "dropbox", {
                    ...localSettings.integrations?.dropbox,
                    accessToken: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                placeholder="Enter Dropbox access token"
              />
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Slack</h3>
              <p className="text-sm text-gray-500">
                Send notifications to Slack
              </p>
            </div>
            <button
              onClick={() =>
                updateLocalSetting("integrations", "slack", {
                  ...localSettings.integrations?.slack,
                  enabled: !localSettings.integrations?.slack?.enabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.integrations?.slack?.enabled
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.integrations?.slack?.enabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {localSettings.integrations?.slack?.enabled && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={localSettings.integrations?.slack?.webhookUrl || ""}
                onChange={(e) =>
                  updateLocalSetting("integrations", "slack", {
                    ...localSettings.integrations?.slack,
                    webhookUrl: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                placeholder="Enter Slack webhook URL"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "preferences":
        return renderPreferencesSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "security":
        return renderSecuritySettings();
      case "integrations":
        return renderIntegrationsSettings();
      default:
        return renderProfileSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <TbLoader className="animate-spin" size={20} />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
      {/* Settings Navigation */}
      <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6">
          {renderTabContent()}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={resetSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 text-sm"
                >
                  {isSaving ? (
                    <TbLoader className="animate-spin" size={16} />
                  ) : (
                    <TbRefresh size={16} />
                  )}
                  Reset to Defaults
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 text-sm"
                >
                  <TbLogout size={16} />
                  Logout
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isSaving && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <TbLoader className="animate-spin" size={16} />
                    Saving...
                  </div>
                )}
                <button
                  onClick={loadSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
                >
                  <TbRefresh size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
