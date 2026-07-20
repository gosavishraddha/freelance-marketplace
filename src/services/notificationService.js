import { db } from "../mock/db";

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  getNotifications: async (userId) => {
    await delay();
    const notifications = db.getNotifications();
    return notifications.filter(n => n.userId === userId);
  },

  markAsRead: async (notificationId) => {
    await delay();
    const notifications = db.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      db.setNotifications(notifications);
      return notifications[index];
    }
    throw new Error("Notification not found");
  },

  markAllAsRead: async (userId) => {
    await delay();
    const notifications = db.getNotifications();
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    db.setNotifications(notifications);
    return true;
  },

  deleteNotification: async (notificationId) => {
    await delay();
    const notifications = db.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    db.setNotifications(filtered);
    return true;
  },

  addNotification: async (userId, title, message, type = "system") => {
    const notifications = db.getNotifications();
    const newNot = {
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    notifications.unshift(newNot);
    db.setNotifications(notifications);
    return newNot;
  }
};
