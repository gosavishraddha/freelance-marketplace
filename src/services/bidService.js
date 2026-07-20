import { db } from "../mock/db";
import { contractService } from "./contractService";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const bidService = {
  submitBid: async (bidData, freelancer) => {
    await delay();
    const bids = db.getBids();
    
    // Check if freelancer already bid on this project
    const exists = bids.some(b => b.projectId === bidData.projectId && b.freelancerId === freelancer.id);
    if (exists) {
      throw new Error("You have already submitted a bid for this project");
    }

    const newBid = {
      id: `bid-${Math.random().toString(36).substr(2, 9)}`,
      projectId: bidData.projectId,
      freelancerId: freelancer.id,
      freelancerName: freelancer.name,
      freelancerAvatar: freelancer.avatar,
      freelancerTitle: freelancer.title,
      freelancerRating: freelancer.rating || 5.0,
      proposal: bidData.proposal,
      amount: Number(bidData.amount),
      duration: Number(bidData.duration),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    bids.unshift(newBid);
    db.setBids(bids);

    // Update project bids count
    const projects = db.getProjects();
    const projectIndex = projects.findIndex(p => p.id === bidData.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].bidsCount = (projects[projectIndex].bidsCount || 0) + 1;
      db.setProjects(projects);

      // Create notification for the client
      const notifications = db.getNotifications();
      notifications.unshift({
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: projects[projectIndex].clientId,
        title: "New Proposal Received",
        message: `${freelancer.name} submitted a bid of $${bidData.amount} for "${projects[projectIndex].title}".`,
        type: "bid",
        read: false,
        timestamp: new Date().toISOString()
      });
      db.setNotifications(notifications);
    }

    return newBid;
  },

  getBidsByProject: async (projectId) => {
    await delay();
    const bids = db.getBids();
    return bids.filter(b => b.projectId === projectId);
  },

  getBidsByFreelancer: async (freelancerId) => {
    await delay();
    const bids = db.getBids();
    return bids.filter(b => b.freelancerId === freelancerId);
  },

  acceptBid: async (bidId) => {
    await delay();
    const bids = db.getBids();
    const bidIndex = bids.findIndex(b => b.id === bidId);
    if (bidIndex === -1) {
      throw new Error("Bid not found");
    }

    // Set bid status to accepted
    bids[bidIndex].status = "accepted";
    const acceptedBid = bids[bidIndex];

    // Reject other bids for this project
    bids.forEach(b => {
      if (b.projectId === acceptedBid.projectId && b.id !== bidId) {
        b.status = "rejected";
      }
    });
    db.setBids(bids);

    // Update project status to ongoing
    const projects = db.getProjects();
    const projectIndex = projects.findIndex(p => p.id === acceptedBid.projectId);
    let project = null;
    if (projectIndex !== -1) {
      projects[projectIndex].status = "ongoing";
      project = projects[projectIndex];
      db.setProjects(projects);
    }

    // Create a new contract
    if (project) {
      const contract = await contractService.createContract({
        projectId: project.id,
        projectTitle: project.title,
        clientId: project.clientId,
        clientName: project.clientName,
        freelancerId: acceptedBid.freelancerId,
        freelancerName: acceptedBid.freelancerName,
        amount: acceptedBid.amount,
        duration: acceptedBid.duration
      });

      // Create notification for freelancer
      const notifications = db.getNotifications();
      notifications.unshift({
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: acceptedBid.freelancerId,
        title: "Bid Accepted!",
        message: `Your bid of $${acceptedBid.amount} for "${project.title}" has been accepted. A contract is now active.`,
        type: "contract",
        read: false,
        timestamp: new Date().toISOString()
      });
      db.setNotifications(notifications);

      return contract;
    }

    return null;
  },

  rejectBid: async (bidId) => {
    await delay();
    const bids = db.getBids();
    const index = bids.findIndex(b => b.id === bidId);
    if (index === -1) {
      throw new Error("Bid not found");
    }

    bids[index].status = "rejected";
    db.setBids(bids);

    const rejectedBid = bids[index];
    const projects = db.getProjects();
    const project = projects.find(p => p.id === rejectedBid.projectId);
    
    if (project) {
      // Notify freelancer
      const notifications = db.getNotifications();
      notifications.unshift({
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: rejectedBid.freelancerId,
        title: "Proposal Update",
        message: `Your bid on "${project.title}" was declined by the client.`,
        type: "bid",
        read: false,
        timestamp: new Date().toISOString()
      });
      db.setNotifications(notifications);
    }

    return true;
  }
};
