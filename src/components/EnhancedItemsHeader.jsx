import React from "react";
import {
  TbPlus,
  TbDownload,
  TbUpload,
  TbSettings,
  TbRefresh,
} from "react-icons/tb";

const EnhancedItemsHeader = ({
  itemCount,
  totalItems,
  onAddItem,
  onImport,
  onExport,
  onRefresh,
  isLoading,
  selectedItems,
  onBulkActions,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Items</h1>
          <p className="text-gray-600">
            {itemCount} of {totalItems} items
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TbUpload size={16} />
            Import
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TbDownload size={16} />
            Export
          </button>
          {selectedItems.length > 0 && (
            <button
              onClick={onBulkActions}
              className="flex items-center gap-2 px-4 py-2 text-primary border border-[var(--primary-light)] rounded-lg hover:bg-primary-light transition-colors"
            >
              <TbSettings size={16} />
              Bulk Actions ({selectedItems.length})
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              isLoading
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-primary border-[var(--primary-light)] hover:bg-primary-light"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Refreshing...
              </>
            ) : (
              <>
                <TbRefresh size={16} />
                Refresh
              </>
            )}
          </button>
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors"
          >
            <TbPlus size={16} />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedItemsHeader;
