import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ClientLayout } from "../layouts/ClientLayout";
import { FreelancerLayout } from "../layouts/FreelancerLayout";
import { AdminLayout } from "../layouts/AdminLayout";

// Common / Public Pages
import { LandingPage } from "../pages/LandingPage";
import { BrowseProjectsPublic } from "../pages/BrowseProjectsPublic";
import { BrowseFreelancersPublic } from "../pages/BrowseFreelancersPublic";
import { CategoriesPage } from "../pages/Categories";
import { About } from "../pages/About";
import { Blog } from "../pages/Blog";
import { Referral } from "../pages/Referral";
import { Contact } from "../pages/Contact";
import { Terms } from "../pages/Terms";
import { Privacy } from "../pages/Privacy";
import { Unauthorized } from "../pages/Unauthorized";
import { NotFound } from "../pages/NotFound";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { RoleSelection } from "../pages/auth/RoleSelection";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { OTPVerification } from "../pages/auth/OTPVerification";
import { ResetPassword } from "../pages/auth/ResetPassword";

// Client Pages
import { ClientDashboard } from "../pages/client/Dashboard";
import { ClientProjects } from "../pages/client/Projects";
import { ClientProjectDetails } from "../pages/client/ProjectDetails";
import { ClientContracts } from "../pages/client/Contracts";
import { ClientContractDetails } from "../pages/client/ContractDetails";
import { ClientPayments } from "../pages/client/Payments";
import { ClientChat } from "../pages/client/Chat";
import { ClientSettings } from "../pages/client/Settings";

// Freelancer Pages
import { FreelancerDashboard } from "../pages/freelancer/Dashboard";
import { FreelancerBrowseProjects } from "../pages/freelancer/BrowseProjects";
import { FreelancerProjectDetails } from "../pages/freelancer/ProjectDetails";
import { FreelancerContracts } from "../pages/freelancer/Contracts";
import { FreelancerContractDetails } from "../pages/freelancer/ContractDetails";
import { FreelancerWallet } from "../pages/freelancer/Wallet";
import { FreelancerChat } from "../pages/freelancer/Chat";
import { FreelancerSettings } from "../pages/freelancer/Settings";

// Admin Pages
import { AdminDashboard } from "../pages/admin/Dashboard";
import { AdminManageUsers } from "../pages/admin/ManageUsers";
import { AdminManageProjects } from "../pages/admin/ManageProjects";
import { AdminDisputes } from "../pages/admin/Disputes";
import { AdminPayments } from "../pages/admin/Payments";
import { AdminSettings } from "../pages/admin/Settings";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse-projects" element={<BrowseProjectsPublic />} />
        <Route path="/browse-freelancers" element={<BrowseFreelancersPublic />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* Unauthorized Access Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Auth Layout Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Client Pages */}
      <Route path="/client" element={<ClientLayout />}>
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="projects/:id" element={<ClientProjectDetails />} />
        <Route path="contracts" element={<ClientContracts />} />
        <Route path="contracts/:id" element={<ClientContractDetails />} />
        <Route path="payments" element={<ClientPayments />} />
        <Route path="chat" element={<ClientChat />} />
        <Route path="settings" element={<ClientSettings />} />
        {/* Fallback to dashboard */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Freelancer Pages */}
      <Route path="/freelancer" element={<FreelancerLayout />}>
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="browse" element={<FreelancerBrowseProjects />} />
        <Route path="projects/:id" element={<FreelancerProjectDetails />} />
        <Route path="contracts" element={<FreelancerContracts />} />
        <Route path="contracts/:id" element={<FreelancerContractDetails />} />
        <Route path="wallet" element={<FreelancerWallet />} />
        <Route path="chat" element={<FreelancerChat />} />
        <Route path="settings" element={<FreelancerSettings />} />
        {/* Fallback to dashboard */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Admin Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminManageUsers />} />
        <Route path="projects" element={<AdminManageProjects />} />
        <Route path="disputes" element={<AdminDisputes />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Fallback to dashboard */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Error Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};