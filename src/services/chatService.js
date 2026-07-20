import { db } from "../mock/db";

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const chatService = {
  getMessagesBetweenUsers: async (userId, partnerId) => {
    await delay();
    const messages = db.getMessages();
    return messages.filter(
      m => (m.senderId === userId && m.recipientId === partnerId) ||
           (m.senderId === partnerId && m.recipientId === userId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  sendMessage: async (senderId, recipientId, content) => {
    await delay();
    const messages = db.getMessages();
    const newMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      recipientId,
      content,
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    db.setMessages(messages);

    // Add a notification for the recipient
    const users = db.getUsers();
    const sender = users.find(u => u.id === senderId);
    const senderName = sender ? sender.name : "Someone";
    
    const notifications = db.getNotifications();
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: recipientId,
      title: "New Message",
      message: `You received a message from ${senderName}: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
      type: "chat",
      read: false,
      timestamp: new Date().toISOString()
    });
    db.setNotifications(notifications);

    return newMessage;
  },

  getActiveChats: async (userId) => {
    await delay();
    const messages = db.getMessages();
    const users = db.getUsers();
    
    // Find all users who have exchanged messages with this user
    const chatPartners = new Set();
    messages.forEach(m => {
      if (m.senderId === userId) chatPartners.add(m.recipientId);
      if (m.recipientId === userId) chatPartners.add(m.senderId);
    });

    // Also check bids/contracts to automatically enable chat with people you bid on or hired
    const contracts = db.getContracts();
    contracts.forEach(c => {
      if (c.clientId === userId) chatPartners.add(c.freelancerId);
      if (c.freelancerId === userId) chatPartners.add(c.clientId);
    });

    const bids = db.getBids();
    const projects = db.getProjects();
    bids.forEach(b => {
      if (b.freelancerId === userId) {
        const proj = projects.find(p => p.id === b.projectId);
        if (proj) chatPartners.add(proj.clientId);
      }
    });

    // Populate user details for each partner
    const activeChats = [];
    chatPartners.forEach(partnerId => {
      const partner = users.find(u => u.id === partnerId);
      if (partner) {
        // Find last message
        const partnerMsgs = messages.filter(
          m => (m.senderId === userId && m.recipientId === partnerId) ||
               (m.senderId === partnerId && m.recipientId === userId)
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        activeChats.push({
          user: partner,
          lastMessage: partnerMsgs[0] || { content: "Start a conversation", timestamp: new Date().toISOString() }
        });
      }
    });

    return activeChats.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
  }
};
