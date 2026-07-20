import React, { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { AlertTriangle, ShieldAlert, ArrowRight, DollarSign, ExternalLink, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export const AdminDisputes = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const list = await contractService.getAllContracts();
      const disputedList = list.filter((c) => c.status === "disputed");
      setContracts(disputedList);
      if (disputedList.length > 0) {
        setSelectedContract(disputedList[0]);
      } else {
        setSelectedContract(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = async (decision) => {
    if (!selectedContract) return;

    const actionText = decision === "refund_client" 
      ? `refund the Client (${selectedContract.clientName})`
      : `pay the Freelancer (${selectedContract.freelancerName})`;

    if (window.confirm(`Are you sure you want to resolve this dispute and ${actionText}? The escrow balance of $${selectedContract.amount} will be released accordingly. This action cannot be reversed.`)) {
      setSubmitting(true);
      try {
        await contractService.resolveDispute(selectedContract.id, decision);
        alert("Dispute resolved successfully!");
        loadDisputes();
      } catch (e) {
        alert(e.message || "Failed to resolve dispute");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Escrow Disputes Arbitration Desk</h2>
        <p className="text-xs text-gray-400">Review open dispute requests, audit workspace deliverables, and resolve escrow funds</p>
      </div>

      {loading ? (
        <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
      ) : contracts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No active escrow disputes found in the queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: list of disputed contracts */}
          <aside className="space-y-3 lg:col-span-1">
            <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Disputes Queue</span>
            {contracts.map((c) => {
              const isSelected = selectedContract?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContract(c)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "border-rose-500 bg-rose-50/10"
                      : "border-gray-150 dark:border-gray-850 hover:bg-gray-50 bg-white dark:bg-gray-900"
                  }`}
                >
                  <h4 className="text-xs font-bold text-gray-905 dark:text-white line-clamp-1 mb-1">{c.projectTitle}</h4>
                  <div className="flex justify-between items-center text-xxs text-gray-450 mt-2 font-medium">
                    <span>Val: ${c.amount}</span>
                    <Badge variant="red">DISPUTED</Badge>
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Right: selected dispute details & arbitration controls */}
          <main className="lg:col-span-2">
            {selectedContract && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-6">
                
                {/* Header detail */}
                <div className="pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{selectedContract.projectTitle}</h3>
                    <p className="text-xxs text-gray-400 font-semibold uppercase">Contract ID: {selectedContract.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xxs text-gray-400 block uppercase font-bold">Escrow sum</span>
                    <span className="text-sm font-extrabold text-gray-950 dark:text-white flex items-center justify-end mt-0.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" /> {selectedContract.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Parties Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-xl text-xxs leading-normal">
                    <span className="text-gray-400 font-bold block mb-1">CLIENT PARTICIPANT</span>
                    <p className="font-extrabold text-gray-900 dark:text-white text-xs">{selectedContract.clientName}</p>
                    <p className="text-gray-450 mt-0.5">ID: {selectedContract.clientId}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-xl text-xxs leading-normal">
                    <span className="text-gray-450 font-bold block mb-1">FREELANCER PARTICIPANT</span>
                    <p className="font-extrabold text-gray-900 dark:text-white text-xs">{selectedContract.freelancerName}</p>
                    <p className="text-gray-400 mt-0.5">ID: {selectedContract.freelancerId}</p>
                  </div>
                </div>

                {/* Work deliverables preview */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide">Submitted Assets Audits</h4>
                  {selectedContract.workSubmitted ? (
                    <div className="space-y-3 bg-gray-50 dark:bg-gray-955 p-4 rounded-2xl border border-gray-100 dark:border-gray-850">
                      {selectedContract.workDesc && (
                        <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed">
                          <span className="font-bold block text-gray-900 dark:text-white mb-1">Freelancer deliverable logs:</span>
                          "{selectedContract.workDesc}"
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-3.5">
                        {selectedContract.workGithub && (
                          <a
                            href={selectedContract.workGithub}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xxs font-bold text-gray-700 hover:text-rose-500 dark:text-gray-300"
                          >
                            <GitBranch className="w-4 h-4 text-rose-500" /> Github Repo <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        )}
                        {selectedContract.workDemo && (
                          <a
                            href={selectedContract.workDemo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xxs font-bold text-gray-700 hover:text-rose-500 dark:text-gray-300"
                          >
                            <ExternalLink className="w-4 h-4 text-rose-500" /> Live Demo <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 text-center rounded-xl text-xxs text-gray-450">
                      No code deliverables submitted yet by the freelancer.
                    </div>
                  )}
                </div>

                {/* Arbitration actions */}
                <div className="pt-5 border-t border-gray-150 dark:border-gray-800 space-y-4">
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">Arbitration Decision Settle</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="danger"
                      onClick={() => handleResolve("refund_client")}
                      disabled={submitting}
                      className="px-6 py-2.5 font-bold"
                    >
                      Refund Escrow to Client
                    </Button>
                    <Button
                      variant="accent"
                      onClick={() => handleResolve("pay_freelancer")}
                      disabled={submitting}
                      className="px-6 py-2.5 font-bold"
                    >
                      Release Escrow to Freelancer
                    </Button>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
