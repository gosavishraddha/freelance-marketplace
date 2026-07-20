import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { contractService } from "../../services/contractService";
import { bidService } from "../../services/bidService";
import { StatisticsCard } from "../../components/cards/StatisticsCard";
import { useNotifications } from "../../context/NotificationContext";
import { Badge } from "../../components/ui/Badge";
import {
  TrendingUp,
  Wallet,
  Star,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

export const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [contracts, setContracts] = useState([]);
  const [bidsCount, setBidsCount] = useState(0);
  const [stats, setStats] = useState({
    activeContracts: 0,
    walletBalance: 0,
    totalBids: 0,
    ratingScore: 5.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const list = await contractService.getContractsByFreelancer(user.id);
        const freelancerBids = await bidService.getBidsByFreelancer(user.id);

        setContracts(list.slice(0, 2));
        setBidsCount(freelancerBids.length);

        const active = list.filter(c => c.status === "active" || c.status === "review").length;

        setStats({
          activeContracts: active,
          walletBalance: user.walletBalance || 0,
          totalBids: freelancerBids.length,
          ratingScore: user.rating || 5.0
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "blue";
      case "review": return "orange";
      case "completed": return "green";
      case "disputed": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-accent to-emerald-500 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome, {user.name}!</h2>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Browse active client jobs, submit proposals, complete deliverables, and build your profile reputation.
          </p>
        </div>
        <Link
          to="/freelancer/browse"
          className="px-5 py-2.5 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all text-xs tracking-wide uppercase shadow-sm self-start md:self-auto"
        >
          <span className="flex items-center gap-1.5">
            Browse Projects
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticsCard
          title="Digital Wallet"
          value={`$${stats.walletBalance.toLocaleString()}`}
          icon={Wallet}
        />
        <StatisticsCard
          title="Active Contracts"
          value={stats.activeContracts}
          icon={FileSpreadsheet}
        />
        <StatisticsCard
          title="Total Bids Placed"
          value={stats.totalBids}
          icon={TrendingUp}
        />
        <StatisticsCard
          title="Professional Rating"
          value={`${stats.ratingScore.toFixed(1)} / 5.0`}
          icon={Star}
        />
      </div>

      {/* Main layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contracts list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Contracts</h3>
            <Link
              to="/freelancer/contracts"
              className="text-xs text-accent font-bold hover:underline flex items-center gap-1"
            >
              All contracts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ) : contracts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
              <p className="text-xs text-gray-500 mb-3">No active contracts assigned yet.</p>
              <Link to="/freelancer/browse" className="text-xs text-accent font-bold hover:underline">
                Find projects to place proposals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contracts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <Badge variant={getStatusColor(c.status)}>
                        {c.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Val: ${c.amount}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-950 dark:text-white mb-2 line-clamp-1">
                      {c.projectTitle}
                    </h4>

                    <div className="text-xxs text-gray-500 dark:text-gray-400 mb-4 font-semibold uppercase">
                      Client: {c.clientName}
                    </div>
                  </div>

                  <Link
                    to={`/freelancer/contracts/${c.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-xxs font-bold text-accent hover:text-white border border-accent hover:bg-accent rounded-xl transition-all shadow-sm"
                  >
                    Manage Contract
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Tips / Help Desk */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium flex gap-4 items-start">
            <div className="p-3 bg-accent-50 text-accent dark:bg-accent-950/20 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">Escrow Payout Guarantee</h4>
              <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">
                GigSphere automatically locks client funds in escrow before contracts start. Complete deliverables, publish github credentials, and submit milestones for quick client release.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts and Quick actions */}
        <div className="space-y-6">
          {/* Alerts feed */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Latest Alerts</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {notifications.filter(n => !n.read).slice(0, 3).length === 0 ? (
                <p className="text-xs text-gray-450 dark:text-gray-550 text-center py-6">
                  No new messages or alerts.
                </p>
              ) : (
                notifications.filter(n => !n.read).slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950 dark:text-white">{n.title}</span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xxs text-gray-500 dark:text-gray-400 leading-normal">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Workspace Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/freelancer/browse"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-accent/40 hover:bg-accent-50/5 text-center transition-all group flex flex-col items-center"
              >
                <TrendingUp className="w-5 h-5 text-accent group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Find Projects</span>
              </Link>
              <Link
                to="/freelancer/wallet"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/5 text-center transition-all group flex flex-col items-center"
              >
                <Wallet className="w-5 h-5 text-emerald-550 group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">My Wallet</span>
              </Link>
              <Link
                to="/freelancer/chat"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-blue-400/40 hover:bg-blue-400/5 text-center transition-all group flex flex-col items-center"
              >
                <MessageSquare className="w-5 h-5 text-blue-450 group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Inbox Chat</span>
              </Link>
              <Link
                to="/freelancer/settings"
                className="p-4 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-rose-500/40 hover:bg-rose-500/5 text-center transition-all group flex flex-col items-center"
              >
                <Star className="w-5 h-5 text-rose-500 group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Portfolio</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
