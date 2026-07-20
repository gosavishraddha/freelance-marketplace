import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Zap, UserCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h3>
        <p className="text-xs text-gray-400">Choose your workspace profile type to begin onboarding</p>
      </div>

      <div className="space-y-4">
        {/* Client Card */}
        <motion.div
          whileHover={{ x: 4 }}
          onClick={() => handleSelectRole("client")}
          className="p-5 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-primary/50 hover:bg-primary-50/5 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary-50 dark:bg-primary-950/20 text-primary dark:text-primary-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none mb-1">I want to Hire</h4>
              <p className="text-xxs text-gray-400 leading-tight">Post projects and contract top remote talent</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
        </motion.div>

        {/* Freelancer Card */}
        <motion.div
          whileHover={{ x: 4 }}
          onClick={() => handleSelectRole("freelancer")}
          className="p-5 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-accent/50 hover:bg-accent-50/5 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-accent-50 dark:bg-accent-950/20 text-accent dark:text-accent-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none mb-1">I want to Work</h4>
              <p className="text-xxs text-gray-400 leading-tight">Find client jobs, pitch bids, and earn money</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
        </motion.div>

        {/* Admin Card */}
        <motion.div
          whileHover={{ x: 4 }}
          onClick={() => handleSelectRole("admin")}
          className="p-5 border border-gray-150 dark:border-gray-850 rounded-2xl hover:border-rose-500/50 hover:bg-rose-500/5 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none mb-1">I am Admin</h4>
              <p className="text-xxs text-gray-400 leading-tight">Manage the marketplace and settle disputes</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
        </motion.div>
      </div>

      <div className="mt-8 text-center text-xs">
        <p className="text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:underline font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
