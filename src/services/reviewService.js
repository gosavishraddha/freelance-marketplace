import { db } from "../mock/db";
import { contractService } from "./contractService";

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  getReviewsForUser: async (userId) => {
    await delay();
    const contracts = db.getContracts();
    const reviews = [];

    contracts.forEach(c => {
      if (c.freelancerId === userId && c.reviewFromClient) {
        reviews.push({
          id: `rev-${c.id}-client`,
          reviewerName: c.clientName,
          rating: c.reviewFromClient.rating,
          comment: c.reviewFromClient.comment,
          projectTitle: c.projectTitle,
          role: "client",
          createdAt: c.createdAt
        });
      }
      if (c.clientId === userId && c.reviewFromFreelancer) {
        reviews.push({
          id: `rev-${c.id}-free`,
          reviewerName: c.freelancerName,
          rating: c.reviewFromFreelancer.rating,
          comment: c.reviewFromFreelancer.comment,
          projectTitle: c.projectTitle,
          role: "freelancer",
          createdAt: c.createdAt
        });
      }
    });

    return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  submitReview: async (contractId, role, reviewData) => {
    return contractService.submitReview(contractId, role, reviewData);
  }
};
