import { db } from "../mock/db";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay();
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (user.password !== password) {
      throw new Error("Invalid email or password");
    }
    
    // Save current session
    localStorage.setItem("current_user_session", JSON.stringify(user));
    return user;
  },

  register: async (userData) => {
    await delay();
    const users = db.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (exists) {
      throw new Error("User with this email already exists");
    }
    
    const newUser = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`,
      title: userData.role === "freelancer" ? "Junior Developer" : "Entrepreneur",
      bio: "Welcome to my profile!",
      skills: [],
      rating: 5.0,
      reviewsCount: 0,
      walletBalance: userData.role === "client" ? 10000.00 : 0.00
    };
    
    users.push(newUser);
    db.setUsers(users);
    
    // Save current session
    localStorage.setItem("current_user_session", JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser: () => {
    const session = localStorage.getItem("current_user_session");
    return session ? JSON.parse(session) : null;
  },

  logout: async () => {
    await delay(100);
    localStorage.removeItem("current_user_session");
    return true;
  },

  requestPasswordReset: async (email) => {
    await delay();
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("Email not found");
    }
    // Simulate sending OTP or email reset link
    return { success: true, email, otp: "123456" };
  },

  verifyOTP: async (email, otp) => {
    await delay();
    if (otp === "123456") {
      return { success: true, email };
    }
    throw new Error("Invalid OTP code. Use 123456 for testing.");
  },

  resetPassword: async (email, newPassword) => {
    await delay();
    const users = db.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      throw new Error("User not found");
    }
    users[index].password = newPassword;
    db.setUsers(users);
    return { success: true };
  },

  updateProfile: async (userId, profileData) => {
    await delay();
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...users[index], ...profileData };
    users[index] = updatedUser;
    db.setUsers(users);
    
    // If updating current user, refresh session
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem("current_user_session", JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  },

  getAllUsers: async () => {
    await delay();
    return db.getUsers();
  },

  deleteUser: async (userId) => {
    await delay();
    const users = db.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    db.setUsers(filtered);
    return true;
  }
};
