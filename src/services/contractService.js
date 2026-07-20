import { db } from "../mock/db";
import { paymentService } from "./paymentService";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const contractService = {
  createContract: async (contractData) => {
    // Note: Called internally by bidService.acceptBid or clients hiring directly.
    const contracts = db.getContracts();
    const newContract = {
      id: `cont-${Math.random().toString(36).substr(2, 9)}`,
      projectId: contractData.projectId,
      projectTitle: contractData.projectTitle,
      clientId: contractData.clientId,
      clientName: contractData.clientName,
      freelancerId: contractData.freelancerId,
      freelancerName: contractData.freelancerName,
      amount: contractData.amount,
      duration: contractData.duration,
      status: "active", // active, review, completed, disputed
      escrowPaid: true, // Fund automatically from client wallet
      workSubmitted: false,
      workGithub: "",
      workDemo: "",
      workDesc: "",
      revisionRequest: "",
      reviewFromClient: null,
      reviewFromFreelancer: null,
      createdAt: new Date().toISOString()
    };

    contracts.unshift(newContract);
    db.setContracts(contracts);

    // Charge client wallet and put in escrow
    try {
      await paymentService.deductClientWallet(contractData.clientId, contractData.amount, newContract.id, contractData.projectTitle);
    } catch (e) {
      console.warn("Client wallet balance warning, allowed for mock demonstration: ", e.message);
    }

    return newContract;
  },

  getContractById: async (id) => {
    await delay();
    const contracts = db.getContracts();
    const contract = contracts.find(c => c.id === id);
    if (!contract) {
      throw new Error("Contract not found");
    }
    return contract;
  },

  getContractsByClient: async (clientId) => {
    await delay();
    const contracts = db.getContracts();
    return contracts.filter(c => c.clientId === clientId);
  },

  getContractsByFreelancer: async (freelancerId) => {
    await delay();
    const contracts = db.getContracts();
    return contracts.filter(c => c.freelancerId === freelancerId);
  },

  getAllContracts: async () => {
    await delay();
    return db.getContracts();
  },

  submitWork: async (contractId, deliverables) => {
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    contracts[index] = {
      ...contracts[index],
      status: "review",
      workSubmitted: true,
      workGithub: deliverables.githubLink || "",
      workDemo: deliverables.liveDemoLink || "",
      workDesc: deliverables.description || "",
      revisionRequest: "" // Clear revision if resubmitted
    };
    db.setContracts(contracts);

    const contract = contracts[index];

    // Notify client
    const notifications = db.getNotifications();
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.clientId,
      title: "Work Submitted for Review",
      message: `${contract.freelancerName} has submitted deliverables for "${contract.projectTitle}".`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });
    db.setNotifications(notifications);

    return contract;
  },

  requestRevision: async (contractId, feedback) => {
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    contracts[index].status = "active";
    contracts[index].workSubmitted = false;
    contracts[index].revisionRequest = feedback;
    db.setContracts(contracts);

    const contract = contracts[index];

    // Notify freelancer
    const notifications = db.getNotifications();
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.freelancerId,
      title: "Revision Requested",
      message: `${contract.clientName} requested revisions on "${contract.projectTitle}": "${feedback}"`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });
    db.setNotifications(notifications);

    return contract;
  },

  approveWork: async (contractId) => {
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    contracts[index].status = "completed";
    const contract = contracts[index];
    db.setContracts(contracts);

    // Update project status to completed
    const projects = db.getProjects();
    const projectIndex = projects.findIndex(p => p.id === contract.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].status = "completed";
      db.setProjects(projects);
    }

    // Release escrow to freelancer
    await paymentService.releaseEscrowToFreelancer(contract.freelancerId, contract.amount, contract.id, contract.projectTitle);

    // Notify freelancer
    const notifications = db.getNotifications();
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.freelancerId,
      title: "Work Approved & Funds Released!",
      message: `${contract.clientName} approved your deliverables. $${contract.amount} has been added to your wallet.`,
      type: "payment",
      read: false,
      timestamp: new Date().toISOString()
    });
    db.setNotifications(notifications);

    return contract;
  },

  submitReview: async (contractId, role, reviewData) => {
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    const contract = contracts[index];
    if (role === "client") {
      contract.reviewFromClient = {
        rating: Number(reviewData.rating),
        comment: reviewData.comment
      };
      
      // Update freelancer rating and reviews count
      const users = db.getUsers();
      const freeIdx = users.findIndex(u => u.id === contract.freelancerId);
      if (freeIdx !== -1) {
        const currentCount = users[freeIdx].reviewsCount || 0;
        const currentRating = users[freeIdx].rating || 5.0;
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + Number(reviewData.rating)) / newCount;
        users[freeIdx].reviewsCount = newCount;
        users[freeIdx].rating = Number(newRating.toFixed(1));
        db.setUsers(users);
      }
    } else {
      contract.reviewFromFreelancer = {
        rating: Number(reviewData.rating),
        comment: reviewData.comment
      };

      // Update client rating
      const users = db.getUsers();
      const clientIdx = users.findIndex(u => u.id === contract.clientId);
      if (clientIdx !== -1) {
        const currentCount = users[clientIdx].reviewsCount || 0;
        const currentRating = users[clientIdx].rating || 5.0;
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + Number(reviewData.rating)) / newCount;
        users[clientIdx].reviewsCount = newCount;
        users[clientIdx].rating = Number(newRating.toFixed(1));
        db.setUsers(users);
      }
    }

    db.setContracts(contracts);
    return contract;
  },

  escalateDispute: async (contractId) => {
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    contracts[index].status = "disputed";
    const contract = contracts[index];
    db.setContracts(contracts);

    // Notify admins
    const users = db.getUsers();
    const admins = users.filter(u => u.role === "admin");
    const notifications = db.getNotifications();
    
    admins.forEach(admin => {
      notifications.unshift({
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId: admin.id,
        title: "Dispute Escalated",
        message: `A dispute has been opened for contract "${contract.projectTitle}" (ID: ${contract.id}).`,
        type: "system",
        read: false,
        timestamp: new Date().toISOString()
      });
    });

    // Notify both client and freelancer
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.clientId,
      title: "Dispute Opened",
      message: `The contract "${contract.projectTitle}" has been placed in a Disputed state. Admin review is pending.`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });

    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.freelancerId,
      title: "Dispute Opened",
      message: `The contract "${contract.projectTitle}" has been placed in a Disputed state. Admin review is pending.`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });

    db.setNotifications(notifications);
    return contract;
  },

  resolveDispute: async (contractId, resolutionDecision) => {
    // resolutionDecision: 'refund_client' or 'pay_freelancer'
    await delay();
    const contracts = db.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      throw new Error("Contract not found");
    }

    const contract = contracts[index];
    contracts[index].status = "completed"; // Mark resolved
    db.setContracts(contracts);

    if (resolutionDecision === "refund_client") {
      // Return money to client wallet
      const users = db.getUsers();
      const clientIdx = users.findIndex(u => u.id === contract.clientId);
      if (clientIdx !== -1) {
        users[clientIdx].walletBalance = (users[clientIdx].walletBalance || 0) + contract.amount;
        db.setUsers(users);
      }
      
      // Log transaction
      await paymentService.logTransaction(
        contract.clientId, 
        contract.amount, 
        "refund", 
        `Refund from dispute resolution on contract: ${contract.projectTitle}`,
        contract.id
      );

    } else {
      // Pay freelancer
      const users = db.getUsers();
      const freeIdx = users.findIndex(u => u.id === contract.freelancerId);
      if (freeIdx !== -1) {
        users[freeIdx].walletBalance = (users[freeIdx].walletBalance || 0) + contract.amount;
        db.setUsers(users);
      }

      // Log transaction
      await paymentService.logTransaction(
        contract.freelancerId, 
        contract.amount, 
        "release", 
        `Payment from dispute resolution on contract: ${contract.projectTitle}`,
        contract.id
      );
    }

    // Notify users
    const notifications = db.getNotifications();
    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.clientId,
      title: "Dispute Resolved",
      message: `Dispute resolved by Admin. Resolution: ${resolutionDecision === "refund_client" ? "Refund to Client" : "Release to Freelancer"}.`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });

    notifications.unshift({
      id: `not-${Math.random().toString(36).substr(2, 9)}`,
      userId: contract.freelancerId,
      title: "Dispute Resolved",
      message: `Dispute resolved by Admin. Resolution: ${resolutionDecision === "refund_client" ? "Refund to Client" : "Release to Freelancer"}.`,
      type: "contract",
      read: false,
      timestamp: new Date().toISOString()
    });

    db.setNotifications(notifications);
    return contracts[index];
  }
};
