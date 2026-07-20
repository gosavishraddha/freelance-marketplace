import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { projectService } from "../../services/projectService";
import { contractService } from "../../services/contractService";
import { paymentService } from "../../services/paymentService";
import { StatisticsCard } from "../../components/cards/StatisticsCard";
import { Badge } from "../../components/ui/Badge";
import { Users, Briefcase, AlertTriangle, ShieldCheck, Activity, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    usersCount: 0,
    projectsCount: 0,
    escrowLocked: 0,
    disputesCount: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminMetrics = async () => {
      setLoading(true);
      try {
        const usersList = await authService.getAllUsers();
        const projectsList = await projectService.getProjects();
        const contractsList = await contractService.getAllContracts();

        const escrows = contractsList.reduce((sum, c) => c.status !== "completed" ? sum + c.amount : sum, 0);
        const disputes = contractsList.filter(c => c.status === "disputed").length;

        setMetrics({
          usersCount: usersList.length,
          projectsCount: projectsList.length,
          escrowLocked: escrows,
          disputesCount: disputes
        });

        setRecentUsers(usersList.slice(-3).reverse());
        setRecentProjects(projectsList.slice(-2).reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAdminMetrics();
  }, []);

  const systemLogs = [
    { text: "Dispute assigned to administrative clerk on contract cont-1", time: "3 hours ago", type: "dispute" },
    { text: "Simulated PayPal deposit request approved of $10,000", time: "6 hours ago", type: "payment" },
    { text: "New Freelancer account approved: Sarah Chen", time: "Yesterday", type: "system" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Admin Overview Control Panel</h2>
        <p className="text-xs text-gray-400">Monitor system statistics, settle client disputes, and audit financial escrows</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticsCard
          title="Marketplace Users"
          value={metrics.usersCount}
          icon={Users}
        />
        <StatisticsCard
          title="Posted Projects"
          value={metrics.projectsCount}
          icon={Briefcase}
        />
        <StatisticsCard
          title="Funds Locked in Escrow"
          value={`$${metrics.escrowLocked.toLocaleString()}`}
          icon={ShieldCheck}
        />
        <StatisticsCard
          title="Active Disputes"
          value={metrics.disputesCount}
          icon={AlertTriangle}
          className="border-rose-100 dark:border-rose-950/20"
        />
      </div>

      {/* Layout Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left pane: audits details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-rose-500" />
              System Audit Event Logs
            </h3>

            <div className="space-y-4">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 relative pb-2.5 last:pb-0 border-b border-gray-50 dark:border-gray-850 last:border-0">
                  <div className={`p-1.5 rounded-xl mt-0.5 ${
                    log.type === "dispute" ? "bg-rose-50 text-rose-550 dark:bg-rose-950/20" :
                    log.type === "payment" ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20" :
                    "bg-blue-50 text-blue-650 dark:bg-blue-950/20"
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-normal">{log.text}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newest Projects */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Latest Posted Requirements</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentProjects.map((p) => (
                <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex justify-between items-center gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{p.title}</h4>
                    <p className="text-xxs text-gray-400 mt-0.5">Budget: ${p.budget} | Client: {p.clientName}</p>
                  </div>
                  <Badge variant={p.status === "open" ? "blue" : "orange"}>
                    {p.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: recent members alerts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Newest Members</h3>
            <div className="space-y-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1">{u.name}</h4>
                    <p className="text-[10px] text-gray-405 font-medium">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "client" ? "blue" : u.role === "freelancer" ? "green" : "red"} className="ml-auto">
                    {u.role.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
