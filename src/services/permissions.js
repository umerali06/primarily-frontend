import api from "./api";

export const permissionsService = {
  // Get permissions for a resource
  getResourcePermissions: async (resourceId, resourceType) => {
    const response = await api.get(`/permissions/${resourceId}`, {
      params: { resourceType },
    });
    return response.data;
  },

  // Create new permission
  createPermission: async (permissionData) => {
    const response = await api.post("/permissions", permissionData);
    return response.data;
  },

  // Update permission
  updatePermission: async (id, permissionData) => {
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data;
  },

  // Delete permission
  deletePermission: async (id) => {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async (userId) => {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data;
  },

  // Share resource with user
  shareResource: async (resourceId, resourceType, userId, accessLevel) => {
    const response = await api.post("/permissions/share", {
      resourceId,
      resourceType,
      userId,
      accessLevel,
    });
    return response.data;
  },
};
