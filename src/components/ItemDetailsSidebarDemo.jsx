import React, { useState } from "react";
import ItemDetailsSidebar from "./ItemDetailsSidebar";
import {
  TbInfoCircle,
  TbStar,
  TbBookmark,
  TbAlertCircle,
  TbPhoto,
} from "react-icons/tb";

const ItemDetailsSidebarDemo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Enhanced sample items for the demo with new features
  const sampleItems = [
    {
      _id: "item1",
      id: "item1",
      name: "MacBook Pro 16-inch M3 Max",
      description:
        "Apple MacBook Pro with M3 Max chip, 32GB unified memory, 1TB SSD. Perfect for professional video editing, 3D rendering, and software development.",
      quantity: 3,
      unit: "pieces",
      price: 3499.99,
      minLevel: 5,
      location: "Office Storage Room B - Secure Cabinet 1",
      notes:
        "Reserved for senior development team. High-performance machines for intensive workloads. Requires approval for checkout.",
      tags: [
        { name: "electronics" },
        { name: "computers" },
        { name: "apple" },
        { name: "premium" },
      ],
      folderId: "folder1",
      folderName: "Electronics",
      sku: "MBP-M3-MAX-001",
      barcode: "1234567890123",
      category: "Laptops",
      supplier: "Apple Inc.",
      isBookmarked: true,
      isStarred: false,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
      ],
    },
    {
      _id: "item2",
      id: "item2",
      name: "Dell XPS 15 OLED Developer Edition",
      description:
        "Dell XPS 15 with Intel i9-13900H, 64GB RAM, 2TB SSD, OLED 4K display. Optimized for development with Ubuntu pre-installed.",
      quantity: 1,
      unit: "pieces",
      price: 2899.99,
      minLevel: 3,
      location: "Office Storage Room A - Shelf 2",
      notes:
        "CRITICAL: Only 1 unit left! Urgent reorder needed. Popular choice for Linux developers.",
      tags: [
        { name: "electronics" },
        { name: "computers" },
        { name: "dell" },
        { name: "linux" },
      ],
      folderId: "folder1",
      folderName: "Electronics",
      sku: "XPS-15-OLED-002",
      barcode: "2345678901234",
      category: "Laptops",
      supplier: "Dell Technologies",
      isBookmarked: false,
      isStarred: true,
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-18T11:20:00Z",
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
        "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
      ],
    },
    {
      _id: "item3",
      id: "item3",
      name: "iPhone 15 Pro Max Titanium",
      description:
        "Apple iPhone 15 Pro Max, 1TB, Natural Titanium. Features A17 Pro chip, ProRAW photography, and titanium construction for ultimate durability.",
      quantity: 12,
      unit: "pieces",
      price: 1599.99,
      minLevel: 8,
      location: "Secure Cabinet 2 - Executive Floor",
      notes:
        "Premium flagship devices for C-level executives and key clients. Includes AppleCare+ coverage.",
      tags: [
        { name: "electronics" },
        { name: "phones" },
        { name: "apple" },
        { name: "flagship" },
      ],
      folderId: "folder2",
      folderName: "Mobile Devices",
      sku: "IP15-PM-TI-003",
      barcode: "3456789012345",
      category: "Smartphones",
      supplier: "Apple Inc.",
      isBookmarked: true,
      isStarred: true,
      createdAt: "2024-01-05T13:45:00Z",
      updatedAt: "2024-01-19T16:30:00Z",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400",
      ],
    },
    {
      _id: "item4",
      id: "item4",
      name: "Sony WH-1000XM5 Wireless Headphones",
      description:
        "Industry-leading noise canceling wireless headphones with 30-hour battery life, premium sound quality, and multipoint connection.",
      quantity: 15,
      unit: "pieces",
      price: 399.99,
      minLevel: 10,
      location: "Audio Equipment Storage - Shelf A3",
      notes:
        "Popular choice for remote workers and content creators. Excellent noise cancellation for open office environments.",
      tags: [
        { name: "electronics" },
        { name: "audio" },
        { name: "sony" },
        { name: "wireless" },
      ],
      folderId: "folder3",
      folderName: "Audio Equipment",
      sku: "WH-1000XM5-004",
      barcode: "4567890123456",
      category: "Headphones",
      supplier: "Sony Electronics",
      isBookmarked: false,
      isStarred: false,
      createdAt: "2024-01-08T11:20:00Z",
      updatedAt: "2024-01-17T09:45:00Z",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      ],
    },
  ];

  // Mock implementation of useInventory hook for the demo
  const mockUseInventory = {
    fetchItem: async (id) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const item = sampleItems.find((item) => item._id === id);
      if (!item) throw new Error("Item not found");
      return { item };
    },
    updateItem: async (id, data) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const itemIndex = sampleItems.findIndex((item) => item._id === id);
      if (itemIndex === -1) throw new Error("Item not found");

      const updatedItem = {
        ...sampleItems[itemIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // In a real app, we would update the state here
      return { item: updatedItem };
    },
    deleteItem: async (id) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, we would remove the item from state
      return { success: true };
    },
    fetchItemActivities: async (id) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate mock activities
      return {
        activities: [
          {
            action: "Item Created",
            timestamp: "2023-01-15T10:30:00Z",
            user: { name: "John Doe" },
            details: "Initial item creation",
          },
          {
            action: "Quantity Updated",
            timestamp: "2023-02-20T14:15:00Z",
            user: { name: "Jane Smith" },
            details: "Quantity changed from 3 to 5",
          },
          {
            action: "Price Updated",
            timestamp: "2023-03-10T09:45:00Z",
            user: { name: "John Doe" },
            details: "Price changed from $2399.99 to $2499.99",
          },
          {
            action: "Notes Updated",
            timestamp: "2023-03-20T14:45:00Z",
            user: { name: "Jane Smith" },
            details: "Notes added: 'Reserved for development team'",
          },
        ],
      };
    },
  };

  // Override the useInventory hook for the demo
  React.useEffect(() => {
    // This is just for the demo - in a real app, we would use the actual hook
    const originalUseInventory = require("../hooks/useInventory").default;
    require("../hooks/useInventory").default = () => mockUseInventory;

    return () => {
      // Restore the original hook when the component unmounts
      require("../hooks/useInventory").default = originalUseInventory;
    };
  }, []);

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced Item Details Sidebar Demo
          </h1>
          <p className="text-gray-600 mb-4">
            Click on any item card to explore the enhanced item details sidebar
            with new features:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-primary-light p-3 rounded-lg">
              <h3 className="font-medium text-[var(--primary-dark)] mb-1">
                🖼️ Enhanced Images
              </h3>
              <p className="text-primary">
                Full ImageGallery integration with zoom, navigation, and
                download
              </p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <h3 className="font-medium text-[var(--primary-dark)] mb-1">
                ⭐ Bookmarks & Stars
              </h3>
              <p className="text-primary">
                Mark items as favorites or important with visual indicators
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-1">
                📊 Rich Metrics
              </h3>
              <p className="text-purple-600">
                Color-coded cards showing key metrics and stock status
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-1">
                🔗 Smart Features
              </h3>
              <p className="text-orange-600">
                QR codes, sharing, printing, and related items
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleItems.map((item) => (
            <div
              key={item._id}
              onClick={() => handleItemClick(item._id)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative">
                <div className="aspect-w-16 aspect-h-12">
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
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center"><span class="text-gray-400">No Image</span></div>';
                    }}
                  />
                </div>

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.isBookmarked && (
                    <div className="bg-yellow-100 text-yellow-800 p-1 rounded-full">
                      <TbBookmark size={12} />
                    </div>
                  )}
                  {item.isStarred && (
                    <div className="bg-yellow-100 text-yellow-800 p-1 rounded-full">
                      <TbStar size={12} />
                    </div>
                  )}
                </div>

                {/* Image count */}
                {item.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <TbPhoto size={12} />
                    {item.images.length}
                  </div>
                )}

                {/* Low stock warning */}
                {item.quantity < item.minLevel && (
                  <div className="absolute bottom-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <TbAlertCircle size={12} />
                    Low Stock
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {item.name}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* SKU */}
                <p className="text-xs text-gray-500 font-mono mb-2">
                  SKU: {item.sku}
                </p>

                {/* Price and quantity */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-primary">
                    ${item.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Qty: {item.quantity} {item.unit}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-primary-light text-[var(--primary-dark)] rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Location */}
                <p className="text-xs text-gray-500 truncate">
                  📍 {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced ItemDetailsSidebar */}
        <ItemDetailsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          itemId={selectedItemId}
          onItemUpdate={(updatedItem) => {
            console.log("Item updated:", updatedItem);
            // In a real app, we would update the state here
          }}
          onItemDelete={(itemId) => {
            console.log("Item deleted:", itemId);
            // In a real app, we would remove the item from state
          }}
        />
      </div>
    </div>
  );
};

export default ItemDetailsSidebarDemo;
