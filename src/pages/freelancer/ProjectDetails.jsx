import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { projectService } from "../../services/projectService";
import { bidService } from "../../services/bidService";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { ArrowLeft, DollarSign, Calendar, Clock, Star, ShieldAlert, Award, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const FreelancerProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasBid, setHasBid] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount: "",
      duration: "",
      proposal: ""
    }
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const details = await projectService.getProjectById(id);
      setProject(details);

      // Check if freelancer already submitted a bid
      const bids = await bidService.getBidsByProject(id);
      const bidExists = bids.some((b) => b.freelancerId === user.id);
      setHasBid(bidExists);
    } catch (e) {
      setError(e.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, user]);

  const onSubmitBid = async (data) => {
    setSubmitting(true);
    try {
      await bidService.submitBid(
        {
          projectId: project.id,
          amount: data.amount,
          duration: data.duration,
          proposal: data.proposal
        },
        user
      );
      alert("Proposal submitted successfully!");
      navigate("/freelancer/browse");
    } catch (e) {
      alert(e.message || "Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-gray-250 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
        <p className="text-red-500 font-medium mb-4">{error || "Project not found"}</p>
        <Link to="/freelancer/browse" className="text-xs text-accent font-bold hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to browse list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/freelancer/browse"
          className="p-2 border border-gray-150 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Project Specification</h2>
          <p className="text-xs text-gray-400">Review deliverables specifications and submit your bid proposal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <Badge variant={project.status === "open" ? "blue" : "orange"}>
                {project.status.toUpperCase()}
              </Badge>
              <span className="text-xxs text-gray-405">
                Posted: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-6">
              {project.description}
            </p>

            <h4 className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide mb-3">Required Technical Skills</h4>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary-50 text-primary px-3 py-1 rounded-full dark:bg-primary-950/20 dark:text-primary-400 font-medium"
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

          {/* Proposal Placement Card */}
          {project.status === "open" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Submit Bid Proposal</h3>

              {hasBid ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl text-xs text-emerald-700 dark:text-emerald-450 font-semibold text-center">
                  You have already submitted a bid for this project requirement.
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Bid Amount (USD)"
                      type="number"
                      placeholder="e.g. 4200"
                      error={errors.amount}
                      {...register("amount", {
                        required: "Bid Amount is required",
                        min: { value: 1, message: "Bid must be greater than 0" }
                      })}
                    />

                    <Input
                      label="Delivery Time (Days)"
                      type="number"
                      placeholder="e.g. 14"
                      error={errors.duration}
                      {...register("duration", {
                        required: "Delivery time is required",
                        min: { value: 1, message: "Delivery time must be at least 1 day" }
                      })}
                    />
                  </div>

                  <Textarea
                    label="Proposal Cover Pitch"
                    placeholder="Describe your relevant experience, technical approach, and why the client should hire you..."
                    rows={6}
                    error={errors.proposal}
                    {...register("proposal", {
                      required: "Pitch proposal text is required",
                      minLength: { value: 30, message: "Please explain your pitch in more detail (min 30 characters)" }
                    })}
                  />

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Button type="submit" disabled={submitting} variant="accent">
                      {submitting ? "Submitting Pitch..." : "Submit Proposal Bid"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Client Specs sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Project Target Summary</h4>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Client Budget:
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                ${project.budget.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-450" /> Target Deadline:
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gray-450" /> Category:
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {project.category}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs text-gray-405 font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-current" /> Client Rating:
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {project.clientRating} / 5.0
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl text-xxs text-gray-500">
              <ShieldAlert className="w-4 h-4 shrink-0 text-primary" />
              <span>Escrow milestone payments are secured prior to job kickoff.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
