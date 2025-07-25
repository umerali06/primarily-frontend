import React, { useState } from "react";
import { TbColumns, TbX } from "react-icons/tb";

/**
 * Component for customizing grid column settings
 *
 * @param {Object} columnSettings - Current column settings
 * @param {Function} onSave - Function to call when settings are saved
 * @returns {React.ReactNode}
 */
const ColumnCustomizer = ({ columnSettings, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(columnSettings);

  const handleSave = () => {
    onSave(settings);
    setIsOpen(false);
  };

  const handleChange = (breakpoint, value) => {
    setSettings((prev) => ({
      ...prev,
      [breakpoint]: parseInt(value, 10),
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="Customize columns"
      >
        <TbColumns size={16} />
        <span className="text-sm">Columns</span>
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-64 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Customize Grid</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <TbX size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Small screens (sm)
          </label>
          <select
            value={settings.sm}
            onChange={(e) => handleChange("sm", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          >
            <option value={1}>1 column</option>
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medium screens (md)
          </label>
          <select
            value={settings.md}
            onChange={(e) => handleChange("md", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          >
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Large screens (lg)
          </label>
          <select
            value={settings.lg}
            onChange={(e) => handleChange("lg", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          >
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
            <option value={5}>5 columns</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Extra large screens (xl)
          </label>
          <select
            value={settings.xl}
            onChange={(e) => handleChange("xl", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          >
            <option value={4}>4 columns</option>
            <option value={5}>5 columns</option>
            <option value={6}>6 columns</option>
            <option value={7}>7 columns</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ColumnCustomizer;
