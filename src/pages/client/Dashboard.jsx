import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { projectService } from "../../services/projectService";
import { contractService } from "../../services/contractService";
import { StatisticsCard } from "../../components/cards/StatisticsCard";
import { ProjectCard } from "../../components/cards/ProjectCard";
import { useNotifications } from "../../context/NotificationContext";
import {
  PlusCircle,
  FileText,
  DollarSign,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export const ClientDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    openJobs: 0,
    escrowTotal: 0,
    completedContracts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const clientProjects = await projectService.getClientProjects(user.id);
        const clientContracts = await contractService.getContractsByClient(user.id);

        setProjects(clientProjects.slice(0, 2));
        setContracts(clientContracts);

        // Calculate statistics
        const open = clientProjects.filter(p => p.status === "open").length;
        const active = clientContracts.filter(c => c.status === "active" || c.status === "review").length;
        const completed = clientContracts.filter(c => c.status === "completed").length;
        const escrow = clientContracts.reduce((sum, c) => c.status !== "completed" ? sum + c.amount : sum, 0);

        setStats({
          activeProjects: active,
          openJobs: open,
          escrowTotal: escrow,
          completedContracts: completed
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  // Dynamic activity history
  const activities = [
    { text: "Sarah Chen submitted deliverables for 'Mobile App Figma to Flutter Frontend'", time: "2 hours ago", type: "work" },
    { text: "Milestone escrow funding released for contract: 'Figma to Flutter'", time: "Yesterday", type: "payment" },
    { text: "Sarah Chen submitted proposal of $4,200", time: "3 days ago", type: "bid" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary to-blue-500 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome, {user.name}!</h2>
          <p className="text-xs text-blue-105 font-medium mt-1">
            Build and manage your remote project teams and pay securely using escrow safeguards.
          </p>
        </div>
        <Link
          to="/client/projects"
          className="px-5 py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all text-xs tracking-wide uppercase shadow-sm self-start md:self-auto"
        >
          <span className="flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" />
            Post New Project
          </span>
        </Link>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={TrendingUp}
          change={12}
          changeType="increase"
        />
        <StatisticsCard
          title="Open Listings"
          value={stats.openJobs}
          icon={FileText}
        />
        <StatisticsCard
          title="Escrow Balance"
          value={`$${stats.escrowTotal.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatisticsCard
          title="Completed Jobs"
          value={stats.completedContracts}
          icon={CheckCircle2}
        />
      </div>

      {/* Content Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Projects and Action panels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Projects</h3>
            <Link
              to="/client/projects"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
              <p className="text-sm text-gray-500 mb-3">No project listings found.</p>
              <Link to="/client/projects" className="text-xs text-primary font-bold hover:underline">
                Create your first job post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} role="client" />
              ))}
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Activity Timeline</h3>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3.5 relative group pb-2 last:pb-0">
                  {i < activities.length - 1 && (
                    <span className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
                  )}
                  <div className={`p-1 rounded-full ${
                    act.type === "work" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/20" :
                    act.type === "payment" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20" :
                    "bg-blue-100 text-blue-650 dark:bg-blue-950/20"
                  }`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{act.text}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notifications Feed and Quick buttons */}
        <div className="space-y-6">
          {/* Notifications feed */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Unread Alerts</h3>
              <span className="text-xxs px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full">
                Real-Time
              </span>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {notifications.filter(n => !n.read).slice(0, 3).length === 0 ? (
                <p className="text-xs text-gray-450 dark:text-gray-500 text-center py-6">
                  No unread notifications.
                </p>
              ) : (
                notifications.filter(n => !n.read).slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-950 dark:text-white">{n.title}</span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xxs text-gray-500 dark:text-gray-400 leading-normal">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/client/projects"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-primary/40 hover:bg-primary-50/5 text-center transition-all group flex flex-col items-center"
              >
                <FileText className="w-5 h-5 text-primary group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">My Projects</span>
              </Link>
              <Link
                to="/client/contracts"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-accent/40 hover:bg-accent-50/5 text-center transition-all group flex flex-col items-center"
              >
                <CheckCircle2 className="w-5 h-5 text-accent group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Contracts</span>
              </Link>
              <Link
                to="/client/payments"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/5 text-center transition-all group flex flex-col items-center"
              >
                <DollarSign className="w-5 h-5 text-emerald-500 group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Payments</span>
              </Link>
              <Link
                to="/client/chat"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-blue-400/40 hover:bg-blue-400/5 text-center transition-all group flex flex-col items-center"
              >
                <MessageSquare className="w-5 h-5 text-blue-450 group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Chat Room</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
