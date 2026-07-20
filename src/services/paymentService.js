import { db } from "../mock/db";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    userId: "user-client-1",
    amount: 3200.00,
    type: "escrow_lock", // deposit, withdraw, escrow_lock, release, refund
    description: "Escrow payment locked for contract: Mobile App Figma to Flutter Frontend",
    referenceId: "cont-1",
    timestamp: "2026-07-11T10:05:00.000Z"
  },
  {
    id: "tx-2",
    userId: "user-free-1",
    amount: 3200.00,
    type: "release",
    description: "Funds released from escrow for contract: Mobile App Figma to Flutter Frontend",
    referenceId: "cont-1",
    timestamp: "2026-07-15T09:00:00.000Z"
  },
  {
    id: "tx-3",
    userId: "user-client-1",
    amount: 10000.00,
    type: "deposit",
    description: "Credit card deposit to workspace balance",
    referenceId: "dep-1",
    timestamp: "2026-07-09T12:00:00.000Z"
  }
];

const getTransactions = () => {
  const data = localStorage.getItem("marketplace_transactions");
  return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
};

const setTransactions = (txs) => {
  localStorage.setItem("marketplace_transactions", JSON.stringify(txs));
};

export const paymentService = {
  getTransactionHistory: async (userId) => {
    await delay();
    const txs = getTransactions();
    return txs.filter(t => t.userId === userId);
  },

  getAllTransactions: async () => {
    await delay();
    return getTransactions();
  },

  depositFunds: async (userId, amount) => {
    await delay();
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) {
      throw new Error("User not found");
    }

    users[idx].walletBalance = (users[idx].walletBalance || 0) + Number(amount);
    db.setUsers(users);

    // Update session
    const session = localStorage.getItem("current_user_session");
    if (session) {
      const current = JSON.parse(session);
      if (current.id === userId) {
        current.walletBalance = users[idx].walletBalance;
        localStorage.setItem("current_user_session", JSON.stringify(current));
      }
    }

    // Log transaction
    const txs = getTransactions();
    const newTx = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      amount: Number(amount),
      type: "deposit",
      description: "Added funds to digital wallet",
      referenceId: `dep-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    txs.unshift(newTx);
    setTransactions(txs);

    return users[idx].walletBalance;
  },

  deductClientWallet: async (clientId, amount, contractId, projectTitle) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === clientId);
    if (idx === -1) throw new Error("Client not found");

    if (users[idx].walletBalance < amount) {
      // For testing, we'll allow client's wallet to go negative or just log warning, but let's deduct and log
      console.warn("Client wallet balance is insufficient, allowing negative for mock demo");
    }

    users[idx].walletBalance = (users[idx].walletBalance || 0) - Number(amount);
    db.setUsers(users);

    // Update session
    const session = localStorage.getItem("current_user_session");
    if (session) {
      const current = JSON.parse(session);
      if (current.id === clientId) {
        current.walletBalance = users[idx].walletBalance;
        localStorage.setItem("current_user_session", JSON.stringify(current));
      }
    }

    // Log transaction
    const txs = getTransactions();
    txs.unshift({
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId: clientId,
      amount: Number(amount),
      type: "escrow_lock",
      description: `Escrow payment locked for contract: ${projectTitle}`,
      referenceId: contractId,
      timestamp: new Date().toISOString()
    });
    setTransactions(txs);
  },

  releaseEscrowToFreelancer: async (freelancerId, amount, contractId, projectTitle) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === freelancerId);
    if (idx === -1) throw new Error("Freelancer not found");

    users[idx].walletBalance = (users[idx].walletBalance || 0) + Number(amount);
    db.setUsers(users);

    // Log transaction
    const txs = getTransactions();
    txs.unshift({
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId: freelancerId,
      amount: Number(amount),
      type: "release",
      description: `Escrow payout released for contract: ${projectTitle}`,
      referenceId: contractId,
      timestamp: new Date().toISOString()
    });
    setTransactions(txs);
  },

  logTransaction: async (userId, amount, type, description, referenceId) => {
    const txs = getTransactions();
    txs.unshift({
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      amount: Number(amount),
      type,
      description,
      referenceId,
      timestamp: new Date().toISOString()
    });
    setTransactions(txs);
  }
};
