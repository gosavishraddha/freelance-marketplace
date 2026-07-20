import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Clock, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";

export const ContractCard = ({ contract, role = "client" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "blue";
      case "review": return "orange";
      case "completed": return "green";
      case "disputed": return "red";
      default: return "gray";
    }
  };

  const getTargetLink = () => {
    return role === "client" 
      ? `/client/contracts/${contract.id}`
      : `/freelancer/contracts/${contract.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <Badge variant={getStatusColor(contract.status)}>
            {contract.status.toUpperCase()}
          </Badge>
          <span className="text-xs text-gray-400 font-medium">
            Started: {new Date(contract.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {contract.projectTitle}
        </h4>

        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{role === "client" ? "Freelancer:" : "Client:"}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {role === "client" ? contract.freelancerName : contract.clientName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl mb-4">
          <div>
            <span className="text-xxs text-gray-400 font-semibold block uppercase">Contract Value</span>
            <span className="text-sm font-bold text-gray-950 dark:text-white flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500 mr-0.5" />
              {contract.amount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-xxs text-gray-400 font-semibold block uppercase">Terms</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Clock className="w-3.5 h-3.5 text-gray-400 mr-1" />
              {contract.duration} Days
            </span>
          </div>
        </div>

        {/* Escrow Details */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {contract.escrowPaid ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Escrow fully funded</span>
          ) : (
            <span className="text-red-500 font-medium">Escrow not funded</span>
          )}
        </div>
      </div>

      <Link
        to={getTargetLink()}
        className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-primary hover:text-white border border-primary hover:bg-primary rounded-xl transition-all shadow-sm"
      >
        Manage Contract
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </Link>
    </motion.div>
  );
};
