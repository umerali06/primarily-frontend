import React, { useState } from "react";
import {
  TbEye,
  TbTag,
  TbFolder,
  TbBookmarkFilled,
  TbStarFilled,
} from "react-icons/tb";
import ItemDetailsSidebar from "./ItemDetailsSidebar";

/**
 * Demo component to showcase the enhanced ItemDetailsSidebar
 */
const EnhancedItemDetailsSidebarDemo = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock items with different characteristics to showcase various features
  const mockItems = [
    {
      _id: "item1",
      name: "Professional DSLR Camera",
      description:
        "High-end digital camera with 24.2MP sensor, 4K video recording, and advanced autofocus system. Includes weather sealing and dual memory card slots for professional photography work.",
      quantity: 3,
      unit: "pieces",
      price: 1299.99,
      minLevel: 2,
      location: "Equipment Room B, Shelf 3",
      category: "Photography",
      supplier: "Canon Inc.",
      sku: "CAM-DSLR-2023",
      barcode: "8901234567890",
      tags: ["camera", "photography", "electronics"],
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtZXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      ],
      notes:
        "Purchased in 2023. Includes 2-year extended warranty valid until 2025.",
      isBookmarked: true,
      isStarred: true,
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2023-06-22T14:45:00Z",
      folderName: "Photography Equipment",
    },
    {
      _id: "item2",
      name: "Office Desk Chair",
      description:
        "Ergonomic office chair with adjustable height, lumbar support, and breathable mesh back. Suitable for long working hours.",
      quantity: 12,
      unit: "pieces",
      price: 249.99,
      minLevel: 5,
      location: "Storage Room A, Row 2",
      category: "Furniture",
      supplier: "Office Essentials Ltd.",
      sku: "CHAIR-ERG-001",
      barcode: "7654321098765",
      tags: ["furniture", "office", "chair"],
      images: [
        "https://images.unsplash.com/photo-1505797149-cea018f2feb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2ZmaWNlJTIwY2hhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      ],
      notes:
        "Standard issue for all employees. Order replacement parts from supplier if needed.",
      isBookmarked: false,
      isStarred: false,
      createdAt: "2022-11-05T09:15:00Z",
      updatedAt: "2023-07-10T11:20:00Z",
      folderName: "Office Furniture",
    },
    {
      _id: "item3",
      name: "Wireless Bluetooth Headphones",
      description:
        "Noise-cancelling over-ear headphones with 30-hour battery life, quick charge, and premium sound quality.",
      quantity: 5,
      unit: "pieces",
      price: 199.99,
      minLevel: 10,
      location: "Tech Storage, Cabinet 2",
      category: "Electronics",
      supplier: "Audio Tech Inc.",
      sku: "AUDIO-HP-450",
      barcode: "1234567890123",
      tags: ["audio", "electronics", "accessories"],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      ],
      notes:
        "Popular item, frequently requested by marketing team. Keep stock levels high.",
      isBookmarked: true,
      isStarred: false,
      createdAt: "2023-03-20T13:45:00Z",
      updatedAt: "2023-07-15T16:30:00Z",
      folderName: "Electronics",
    },
    {
      _id: "item4",
      name: "First Aid Kit",
      description:
        "Comprehensive first aid kit containing bandages, antiseptics, pain relievers, and emergency supplies for workplace safety.",
      quantity: 8,
      unit: "kits",
      price: 45.99,
      minLevel: 15,
      location: "All Floors, Safety Cabinet",
      category: "Safety",
      supplier: "MedSupply Co.",
      sku: "SAFETY-FA-100",
      barcode: "5432109876543",
      tags: ["safety", "medical", "emergency"],
      images: [
        "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmlyc3QlMjBhaWQlMjBraXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      ],
      notes:
        "Regulatory requirement: Must maintain minimum stock levels at all times. Check expiration dates monthly.",
      isBookmarked: false,
      isStarred: true,
      createdAt: "2022-09-10T08:20:00Z",
      updatedAt: "2023-07-01T09:15:00Z",
      folderName: "Safety Equipment",
    },
  ];

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleItemUpdate = (updatedItem) => {
    console.log("Item updated:", updatedItem);
    // In a real implementation, this would update the item in state/store
  };

  const handleItemDelete = (itemId) => {
    console.log("Item deleted:", itemId);
    setShowSidebar(false);
    // In a real implementation, this would remove the item from state/store
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Enhanced Item Details Sidebar Demo
        </h2>
        <p className="text-gray-600">
          Click on any item card below to open the enhanced item details
          sidebar. Explore the improved layout, color-coded metrics, and new
          features like QR code generation.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#e6f3f1] p-4 rounded-lg border border-[#e6f3f1]">
          <h3 className="font-medium text-[#0a7662] mb-2">
            🎨 Enhanced Visual Design
          </h3>
          <p className="text-sm text-[#0a7662]">
            Color-coded metric cards, improved layout, and better visual
            hierarchy for easier information scanning.
          </p>
        </div>
        <div className="bg-[#e6f3f1] p-4 rounded-lg border border-[#e6f3f1]">
          <h3 className="font-medium text-[#0a7662] mb-2">
            🖼️ Advanced Image Gallery
          </h3>
          <p className="text-sm text-[#0a7662]">
            Zoom functionality, thumbnail navigation, and image download
            capabilities.
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800 mb-2">
            📱 Smart Features
          </h3>
          <p className="text-sm text-purple-700">
            QR code generation, bookmark/star system, and sharing capabilities.
          </p>
        </div>
      </div>

      {/* Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewItem(item)}
          >
            {/* Item Image */}
            <div className="aspect-square bg-gray-100 relative">
              {item.images && item.images.length > 0 ? (
                <img
                  src={(() => {
                    const image = item.images[0];
                    if (typeof image === "string") {
                      return image;
                    } else if (image?.url) {
                      return image.url;
                    } else if (image?.filename) {
                      // Construct URL from filename
                      const baseUrl =
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:5001";
                      return `${baseUrl}/uploads/items/${image.filename}`;
                    }
                    return null;
                  })()}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              {(!item.images || item.images.length === 0) && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {/* Fallback div for broken images */}
              <div
                className="w-full h-full flex items-center justify-center text-gray-400"
                style={{ display: "none" }}
              >
                Image Not Found
              </div>

              {/* Status Indicators */}
              <div className="absolute top-2 left-2 flex gap-1">
                {item.isBookmarked && (
                  <span className="bg-yellow-100 p-1 rounded-full text-yellow-600">
                    <TbBookmarkFilled size={16} />
                  </span>
                )}
                {item.isStarred && (
                  <span className="bg-yellow-100 p-1 rounded-full text-yellow-600">
                    <TbStarFilled size={16} />
                  </span>
                )}
              </div>

              {/* View Button */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white rounded-full p-2 shadow-md">
                  <TbEye size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Item Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1 truncate">
                {item.name}
              </h3>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {item.quantity} {item.unit}
                </span>
                <span className="font-medium text-[#0a7662]">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {item.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    <TbFolder className="mr-1" size={12} />
                    {item.category}
                  </span>
                )}
                {item.tags && item.tags.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#e6f3f1] text-[#0a7662]">
                    <TbTag className="mr-1" size={12} />
                    {item.tags[0]}
                    {item.tags.length > 1 && ` +${item.tags.length - 1}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Details Sidebar */}
      {showSidebar && selectedItem && (
        <ItemDetailsSidebar
          open={showSidebar}
          onClose={handleCloseSidebar}
          itemId={selectedItem._id}
          onItemUpdate={handleItemUpdate}
          onItemDelete={handleItemDelete}
          // For demo purposes, we're passing the full item directly
          // In a real implementation, the component would fetch the item data
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default EnhancedItemDetailsSidebarDemo;
