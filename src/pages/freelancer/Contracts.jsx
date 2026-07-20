import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { contractService } from "../../services/contractService";
import { ContractCard } from "../../components/cards/ContractCard";
import { FileSpreadsheet } from "lucide-react";

export const FreelancerContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadContracts = async () => {
      setLoading(true);
      try {
        const list = await contractService.getContractsByFreelancer(user.id);
        setContracts(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadContracts();
  }, [user]);

  const filteredContracts = contracts.filter((c) => {
    if (activeTab === "all") return true;
    return c.status === activeTab;
  });

  const tabOptions = [
    { label: "All Agreements", value: "all" },
    { label: "Active Jobs", value: "active" },
    { label: "Review Stage", value: "review" },
    { label: "Completed", value: "completed" },
    { label: "Disputed", value: "disputed" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Assigned Contracts</h2>
        <p className="text-xs text-gray-400">Track active work milestone pipelines, submit deliverables, and review client feedback</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 dark:border-gray-800 overflow-x-auto gap-2">
        {tabOptions.map((tab) => {
          const isActive = activeTab === tab.value;
          const count = tab.value === "all" 
            ? contracts.length
            : contracts.filter(c => c.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-450 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? "bg-accent/10 text-accent" 
                  : "bg-gray-100 text-gray-450 dark:bg-gray-800 dark:text-gray-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
          <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No contracts match the selected status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContracts.map((c) => (
            <ContractCard key={c.id} contract={c} role="freelancer" />
          ))}
        </div>
      )}
    </div>
  );
};
