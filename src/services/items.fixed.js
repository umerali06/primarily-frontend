import api from "./api";

export const itemsService = {
  // Get all items with filtering and pagination
  getItems: async (params = {}) => {
    const response = await api.get("/items", { params });
    return response.data;
  },

  // Get item by ID
  getItem: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Create new item
  createItem: async (itemData) => {
    // Check if itemData is FormData (for image uploads)
    const isFormData = itemData instanceof FormData;

    const config = {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    };

    const response = await api.post("/items", itemData, config);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    // Check if itemData is FormData (for image uploads)
    const isFormData = itemData instanceof FormData;

    const config = {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    };

    const response = await api.put(`/items/${id}`, itemData, config);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  // Update item quantity
  updateQuantity: async (id, change, reason) => {
    const response = await api.put(`/items/${id}/quantity`, { change, reason });
    return response.data;
  },

  // Search items
  searchItems: async (params = {}) => {
    const response = await api.get("/items/search", { params });
    return response.data;
  },

  // Get item statistics
  getItemStats: async () => {
    const response = await api.get("/items/stats");
    return response.data;
  },

  // Upload item image
  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post(`/items/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (id, imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post(`/items/${id}/images/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Remove item image
  removeImage: async (id, imageIndex) => {
    const response = await api.delete(`/items/${id}/images/${imageIndex}`);
    return response.data;
  },

  // Move item to folder
  moveItem: async (id, folderId) => {
    const response = await api.put(`/items/${id}/move`, { folderId });
    return response.data;
  },

  // Bulk update items
  bulkUpdate: async (itemIds, updates) => {
    const response = await api.put("/items/bulk", { itemIds, updates });
    return response.data;
  },

  // Bulk delete items
  bulkDelete: async (itemIds, reason = "") => {
    const response = await api.delete("/items/bulk", {
      data: { itemIds, reason },
    });
    return response.data;
  },

  // Clone item
  cloneItem: async (id, newData = {}) => {
    const response = await api.post(`/items/${id}/clone`, newData);
    return response.data;
  },

  // Get item history/activities
  getItemHistory: async (id, params = {}) => {
    const response = await api.get(`/items/${id}/history`, { params });
    return response.data;
  },

  // Add item to favorites
  addToFavorites: async (id) => {
    const response = await api.post(`/items/${id}/favorite`);
    return response.data;
  },

  // Remove item from favorites
  removeFromFavorites: async (id) => {
    const response = await api.delete(`/items/${id}/favorite`);
    return response.data;
  },

  // Get low stock items
  getLowStockItems: async (params = {}) => {
    const response = await api.get("/items/low-stock", { params });
    return response.data;
  },

  // Export items
  exportItems: async (format = "csv", params = {}) => {
    // Use the correct endpoint based on the format
    const endpoint =
      format === "json" ? "/export/items/json" : "/export/items/csv";

    // Filter out undefined or null values from params
    const cleanParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // Convert any arrays to comma-separated strings
    Object.keys(cleanParams).forEach((key) => {
      if (Array.isArray(cleanParams[key])) {
        cleanParams[key] = cleanParams[key].join(",");
      }
    });

    // Log the export request for debugging
    console.log(
      `Exporting items in ${format} format with params:`,
      cleanParams
    );

    try {
      const response = await api.get(endpoint, {
        params: cleanParams,
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  },

  // Import items
  importItems: async (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    const response = await api.post("/items/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get import template
  getImportTemplate: async (format = "csv") => {
    const response = await api.get("/items/import/template", {
      params: { format },
      responseType: "blob",
    });
    return response;
  },

  // Validate import data
  validateImport: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/items/import/validate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Set item alert
  setAlert: async (id, alertData) => {
    const response = await api.post(`/items/${id}/alert`, alertData);
    return response.data;
  },

  // Remove item alert
  removeAlert: async (id) => {
    const response = await api.delete(`/items/${id}/alert`);
    return response.data;
  },

  // Generate barcode
  generateBarcode: async (id) => {
    const response = await api.post(`/items/${id}/barcode`);
    return response.data;
  },

  // Scan barcode
  scanBarcode: async (barcode) => {
    const response = await api.get(`/items/barcode/${barcode}`);
    return response.data;
  },
};
