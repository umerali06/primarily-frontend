import api from "./api";

class AlertsService {
  constructor() {
    this.pollingInterval = null;
    this.pollingFrequency = 30000; // 30 seconds
    this.listeners = new Set();
    this.lastFetchTime = null;
    this.isPolling = false;
  }

  // Subscribe to real-time updates
  subscribe(callback) {
    this.listeners.add(callback);
    
    // Start polling if not already started
    if (!this.isPolling) {
      this.startPolling();
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  // Start polling for new notifications
  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log('🔄 Starting notification polling...');
    
    // Initial fetch
    this.fetchAndNotify();
    
    // Set up interval
    this.pollingInterval = setInterval(() => {
      this.fetchAndNotify();
    }, this.pollingFrequency);
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('⏹️ Stopped notification polling');
  }

  // Fetch alerts and notify listeners
  async fetchAndNotify() {
    try {
      const params = {};
      if (this.lastFetchTime) {
        params.since = this.lastFetchTime;
      }
      
      const response = await this.getAlerts(params);
      
      if (response.success && response.data.alerts.length > 0) {
        // Notify all listeners
        this.listeners.forEach(callback => {
          try {
            callback(response.data.alerts);
          } catch (error) {
            console.error('Error in notification callback:', error);
          }
        });
      }
      
      this.lastFetchTime = new Date().toISOString();
    } catch (error) {
      console.warn('Error fetching notifications:', error);
    }
  }

  // Get all alerts with filtering and pagination
  async getAlerts(params = {}) {
    try {
      const response = await api.get("/alerts", { params });
      return response.data;
    } catch (error) {
      console.warn("API error during alerts fetch:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Provide mock alerts for demo purposes
        const mockAlerts = this.generateMockAlerts();

        return {
          success: true,
          data: {
            alerts: mockAlerts,
            pagination: {
              page: 1,
              limit: 20,
              total: mockAlerts.length,
              pages: 1,
            },
          },
        };
      }
      throw error;
    }
  }

  // Generate mock alerts for demo
  generateMockAlerts() {
    const now = new Date();
    return [
      {
        _id: "alert1",
        type: "low_quantity",
        status: "active",
        threshold: 5,
        currentValue: 2,
        title: "Low Stock Alert",
        message: "MacBook Pro inventory is running low (2 remaining, minimum: 5)",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        priority: "high",
        actionUrl: "/dashboard?tab=items&item=item1",
        actionText: "View Item",
        itemId: {
          _id: "item1",
          name: "MacBook Pro",
          images: [],
        },
        metadata: {
          itemName: "MacBook Pro",
          previousQuantity: 3,
        }
      },
      {
        _id: "alert2",
        type: "out_of_stock",
        status: "active",
        threshold: 0,
        currentValue: 0,
        title: "Out of Stock Alert",
        message: "Wireless Mouse is out of stock",
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        priority: "critical",
        actionUrl: "/dashboard?tab=items&item=item2",
        actionText: "Restock Item",
        itemId: {
          _id: "item2",
          name: "Wireless Mouse",
          images: [],
        },
        metadata: {
          itemName: "Wireless Mouse",
          previousQuantity: 1,
        }
      },
      {
        _id: "alert3",
        type: "item_updated",
        status: "read",
        title: "Item Updated",
        message: "Office Chair details have been updated",
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        actionUrl: "/dashboard?tab=items&item=item3",
        actionText: "View Changes",
        itemId: {
          _id: "item3",
          name: "Office Chair",
          images: [],
        },
        metadata: {
          itemName: "Office Chair",
          action: "update",
          changes: { price: { from: 150, to: 175 } }
        }
      },
      {
        _id: "alert4",
        type: "system",
        status: "active",
        title: "System Maintenance",
        message: "System maintenance scheduled for tonight at 2:00 AM",
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        metadata: {
          scheduledTime: "2024-01-15T02:00:00Z",
          duration: "2 hours"
        }
      },
      {
        _id: "alert5",
        type: "item_created",
        status: "active",
        title: "New Item Added",
        message: "New item 'Gaming Keyboard' has been added to inventory",
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        priority: "low",
        actionUrl: "/dashboard?tab=items&item=item5",
        actionText: "View Item",
        itemId: {
          _id: "item5",
          name: "Gaming Keyboard",
          images: [],
        },
        metadata: {
          itemName: "Gaming Keyboard",
          action: "create"
        }
      },
      {
        _id: "alert6",
        type: "bulk_operation",
        status: "active",
        title: "Bulk Operation Complete",
        message: "Bulk update completed for 15 items",
        createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        priority: "medium",
        actionUrl: "/dashboard?tab=items",
        actionText: "View Items",
        metadata: {
          operation: "update",
          count: 15
        }
      }
    ];
  }

  // Get alert by ID
  async getAlert(id) {
    try {
      const response = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API error during alert fetch:", error.message);
      throw error;
    }
  }

  // Get alert count by status
  async getAlertCount() {
    try {
      const response = await api.get("/alerts/count");
      return response.data;
    } catch (error) {
      console.warn("API error during alert count fetch:", error.message);

      // Provide mock count for demo purposes
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          data: {
            active: 4,
            read: 1,
            resolved: 0,
            dismissed: 0,
            total: 5,
          },
        };
      }
      throw error;
    }
  }

  // Create custom alert
  async createAlert(alertData) {
    try {
      const response = await api.post("/alerts", alertData);
      
      // Notify listeners of new alert
      if (response.data.success && response.data.data.alert) {
        this.listeners.forEach(callback => {
          try {
            callback([response.data.data.alert]);
          } catch (error) {
            console.error('Error in notification callback:', error);
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.warn("API error during alert creation:", error.message);
      throw error;
    }
  }

  // Update alert status
  async updateAlertStatus(id, status) {
    try {
      const response = await api.put(`/alerts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn("API error during alert status update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          data: {
            alert: {
              _id: id,
              status: status,
              readAt: status === "read" ? new Date().toISOString() : null,
              resolvedAt: status === "resolved" ? new Date().toISOString() : null,
              dismissedAt: status === "dismissed" ? new Date().toISOString() : null,
            },
          },
        };
      }
      throw error;
    }
  }

  // Delete alert
  async deleteAlert(id) {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API error during alert deletion:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Alert deleted successfully",
        };
      }
      throw error;
    }
  }

  // Mark all alerts as read
  async markAllAsRead() {
    try {
      const response = await api.put("/alerts/mark-all-read");
      return response.data;
    } catch (error) {
      console.warn("API error during mark all as read:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "All alerts marked as read",
          data: {
            modifiedCount: 3,
          },
        };
      }
      throw error;
    }
  }

  // Dismiss alert
  async dismissAlert(id) {
    return this.updateAlertStatus(id, 'dismissed');
  }

  // Get notification sound based on priority
  getNotificationSound(priority) {
    switch (priority) {
      case 'critical':
        return 'critical-alert.mp3';
      case 'high':
        return 'high-alert.mp3';
      case 'medium':
        return 'medium-alert.mp3';
      case 'low':
        return 'low-alert.mp3';
      default:
        return 'default-alert.mp3';
    }
  }

  // Show browser notification if supported
  async showBrowserNotification(alert) {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert._id,
        requireInteraction: alert.priority === 'critical',
        silent: alert.priority === 'low'
      });

      notification.onclick = () => {
        window.focus();
        if (alert.actionUrl) {
          window.location.href = alert.actionUrl;
        }
        notification.close();
      };

      // Auto close after 5 seconds for non-critical alerts
      if (alert.priority !== 'critical') {
        setTimeout(() => notification.close(), 5000);
      }

      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return this.showBrowserNotification(alert);
      }
    }

    return false;
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  }
}

// Create singleton instance
export const alertsService = new AlertsService();
export default alertsService;
