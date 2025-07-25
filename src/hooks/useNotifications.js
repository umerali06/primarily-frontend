import { useState, useEffect, useCallback, useRef } from 'react';
import { alertsService } from '../services/alerts';
import toast from 'react-hot-toast';

export const useNotifications = (options = {}) => {
  const {
    enableRealTime = true,
    enableBrowserNotifications = true,
    enableSounds = false,
    autoMarkAsRead = false,
    pollingFrequency = 30000
  } = options;

  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({
    active: 0,
    read: 0,
    resolved: 0,
    dismissed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio for notifications
  useEffect(() => {
    if (enableSounds) {
      audioRef.current = new Audio();
    }
  }, [enableSounds]);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [alertsResponse, countsResponse] = await Promise.all([
        alertsService.getAlerts(),
        alertsService.getAlertCount()
      ]);

      if (alertsResponse.success) {
        setNotifications(alertsResponse.data.alerts || []);
      }

      if (countsResponse.success) {
        setCounts(countsResponse.data || counts);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle new notifications from real-time updates
  const handleNewNotifications = useCallback(async (newAlerts) => {
    if (!Array.isArray(newAlerts) || newAlerts.length === 0) return;

    // Update notifications state
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n._id));
      const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.has(alert._id));
      
      if (uniqueNewAlerts.length === 0) return prev;
      
      return [...uniqueNewAlerts, ...prev].slice(0, 100); // Keep only latest 100
    });

    // Update counts
    try {
      const countsResponse = await alertsService.getAlertCount();
      if (countsResponse.success) {
        setCounts(countsResponse.data);
      }
    } catch (err) {
      console.warn('Failed to update notification counts:', err);
    }

    // Process each new notification
    for (const alert of newAlerts) {
      // Show toast notification
      const toastOptions = {
        duration: alert.priority === 'critical' ? 10000 : 4000,
        position: 'top-right',
      };

      switch (alert.priority) {
        case 'critical':
          toast.error(alert.message, toastOptions);
          break;
        case 'high':
          toast.error(alert.message, toastOptions);
          break;
        case 'medium':
          toast(alert.message, toastOptions);
          break;
        case 'low':
          toast.success(alert.message, toastOptions);
          break;
        default:
          toast(alert.message, toastOptions);
      }

      // Show browser notification
      if (enableBrowserNotifications) {
        try {
          await alertsService.showBrowserNotification(alert);
        } catch (err) {
          console.warn('Failed to show browser notification:', err);
        }
      }

      // Play notification sound
      if (enableSounds && audioRef.current) {
        try {
          const soundFile = alertsService.getNotificationSound(alert.priority);
          audioRef.current.src = `/sounds/${soundFile}`;
          audioRef.current.play().catch(err => {
            console.warn('Failed to play notification sound:', err);
          });
        } catch (err) {
          console.warn('Failed to play notification sound:', err);
        }
      }

      // Auto mark as read for low priority notifications
      if (autoMarkAsRead && alert.priority === 'low') {
        setTimeout(() => {
          markAsRead(alert._id);
        }, 5000);
      }
    }
  }, [enableBrowserNotifications, enableSounds, autoMarkAsRead]);

  // Set up real-time updates
  useEffect(() => {
    if (!enableRealTime) return;

    // Set custom polling frequency
    if (pollingFrequency !== 30000) {
      alertsService.pollingFrequency = pollingFrequency;
    }

    // Subscribe to real-time updates
    unsubscribeRef.current = alertsService.subscribe(handleNewNotifications);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [enableRealTime, pollingFrequency, handleNewNotifications]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Request notification permission on mount
  useEffect(() => {
    if (enableBrowserNotifications) {
      alertsService.requestNotificationPermission();
    }
  }, [enableBrowserNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await alertsService.updateAlertStatus(notificationId, 'read');
      
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, status: 'read', readAt: new Date().toISOString() }
            : notif
        )
      );

      // Update counts
      setCounts(prev => ({
        ...prev,
        active: Math.max(0, prev.active - 1),
        read: prev.read + 1
      }));

      return true;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      toast.error('Failed to mark notification as read');
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await alertsService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          status: 'read',
          readAt: new Date().toISOString()
        }))
      );

      setCounts(prev => ({
        ...prev,
        active: 0,
        read: prev.total
      }));

      toast.success('All notifications marked as read');
      return true;
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
      return false;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await alertsService.updateAlertStatus(notificationId, 'resolved');
      
      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );

      setCounts(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        active: Math.max(0, prev.active - 1)
      }));

      toast.success('Notification deleted');
      return true;
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error('Failed to delete notification');
      return false;
    }
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback(async (notificationId) => {
    try {
      await alertsService.dismissAlert(notificationId);
      
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, status: 'dismissed', dismissedAt: new Date().toISOString() }
            : notif
        )
      );

      setCounts(prev => ({
        ...prev,
        active: Math.max(0, prev.active - 1),
        dismissed: prev.dismissed + 1
      }));

      return true;
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
      toast.error('Failed to dismiss notification');
      return false;
    }
  }, []);

  // Create custom notification
  const createNotification = useCallback(async (notificationData) => {
    try {
      const response = await alertsService.createAlert(notificationData);
      
      if (response.success) {
        toast.success('Custom notification created');
        return response.data.alert;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to create notification:', err);
      toast.error('Failed to create notification');
      return null;
    }
  }, []);

  // Refresh notifications
  const refresh = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    counts,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    dismissNotification,
    createNotification,
    refresh,
    // Utility functions
    getUnreadCount: () => counts.active,
    hasUnread: () => counts.active > 0,
    getNotificationsByType: (type) => notifications.filter(n => n.type === type),
    getNotificationsByPriority: (priority) => notifications.filter(n => n.priority === priority),
  };
};

export default useNotifications;
