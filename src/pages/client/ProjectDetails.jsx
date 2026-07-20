import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { bidService } from "../../services/bidService";
import { Badge } from "../../components/ui/Badge";
import { BidCard } from "../../components/cards/BidCard";
import { ArrowLeft, DollarSign, Calendar, Tag, ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const ClientProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const proj = await projectService.getProjectById(id);
      setProject(proj);
      const projectBids = await bidService.getBidsByProject(id);
      setBids(projectBids);
    } catch (e) {
      setError(e.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAcceptBid = async (bidId) => {
    if (window.confirm("Are you sure you want to hire this freelancer? This will fund the contract escrow and change the project status to ongoing.")) {
      try {
        const contract = await bidService.acceptBid(bidId);
        if (contract) {
          alert("Freelancer hired successfully! Redirecting to contract details...");
          navigate(`/client/contracts/${contract.id}`);
        } else {
          loadData();
        }
      } catch (e) {
        alert(e.message || "Failed to accept proposal");
      }
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await bidService.rejectBid(bidId);
      loadData();
    } catch (e) {
      alert(e.message || "Failed to decline proposal");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-40 bg-gray-250 dark:bg-gray-800 rounded-2xl" />
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
        <p className="text-red-500 font-medium mb-4">{error || "Project not found"}</p>
        <Link to="/client/projects" className="text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to projects list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header back navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/client/projects"
          className="p-2 border border-gray-150 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Project Details Panel</h2>
          <p className="text-xs text-gray-400">Review specifications, deadlines, and active proposals</p>
        </div>
      </div>

      {/* Main Grid: Info card and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project info column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <Badge variant={project.status === "open" ? "blue" : project.status === "ongoing" ? "orange" : "green"}>
                {project.status.toUpperCase()}
              </Badge>
              <span className="text-xxs text-gray-405 font-medium">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h3>

            <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-6">
              {project.description}
            </p>

            <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full dark:bg-primary-950/20 dark:text-primary-400 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {project.attachments && project.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide mb-3">Attachments</h4>
                <div className="flex flex-col gap-2">
                  {project.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-xs w-fit">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Budget sidebar summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Project Financials</h4>
            
            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Allocated Budget:
              </span>
              <span className="text-sm font-bold text-gray-950 dark:text-white">
                ${project.budget.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> Deadline Target:
              </span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gray-450" /> Category:
              </span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {project.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-800/30 rounded-xl text-xxs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Payments are secured in escrow milestones. Funded automatically upon hiring.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Proposals section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Freelancer Proposals ({bids.length})</h3>
        
        {bids.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
            <p className="text-sm text-gray-400">No proposals submitted for this project yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                onAccept={handleAcceptBid}
                onReject={handleRejectBid}
                showActions={project.status === "open"}
                isClient={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
