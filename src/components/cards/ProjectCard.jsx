import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Briefcase, DollarSign, Award, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";

export const ProjectCard = ({ project, showActions = true, role = "freelancer" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "blue";
      case "ongoing": return "orange";
      case "completed": return "green";
      default: return "gray";
    }
  };

  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium hover:shadow-premium-hover transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <Badge variant={getStatusColor(project.status)}>
            {project.status.toUpperCase()}
          </Badge>
          <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
        </div>

        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.title}
        </h4>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Categories / Meta */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Briefcase className="w-3 h-3 mr-1" />
            {project.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Award className="w-3 h-3 mr-1" />
            {project.subcategory}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-primary-50 text-primary-600 px-2.5 py-0.5 rounded-full dark:bg-primary-950/30 dark:text-primary-400 font-medium"
            >
              {skill}
            </span>
          ))}
          {project.skills.length > 4 && (
            <span className="text-xs bg-gray-150 text-gray-600 px-2 py-0.5 rounded-full dark:bg-gray-800 dark:text-gray-400">
              +{project.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Budget</span>
          <span className="text-base font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-4 h-4 text-emerald-500 mr-0.5" />
            {project.budget.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 font-medium">Bids Received</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {project.bidsCount || 0} proposals
          </span>
        </div>
      </div>

      {showActions && (
        <div className="mt-5">
          <Link
            to={role === "client" ? `/client/projects/${project.id}` : `/freelancer/projects/${project.id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-sm"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};
