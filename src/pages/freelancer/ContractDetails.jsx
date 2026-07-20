import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { contractService } from "../../services/contractService";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  ShieldCheck,
  GitBranch,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Star,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const FreelancerContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register: registerDeliverables, handleSubmit: handleDeliverablesSubmit, reset: resetDeliverables, formState: { errors } } = useForm();
  const { register: registerReview, handleSubmit: handleReviewSubmit, setValue: setReviewRating, watch: watchReview } = useForm({
    defaultValues: { rating: 5, comment: "" }
  });

  const ratingVal = watchReview("rating");

  const loadContract = async () => {
    setLoading(true);
    try {
      const details = await contractService.getContractById(id);
      setContract(details);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContract();
  }, [id]);

  const onDeliver = async (data) => {
    setSubmitting(true);
    try {
      await contractService.submitWork(contract.id, {
        githubLink: data.githubLink,
        liveDemoLink: data.liveDemoLink,
        description: data.description
      });
      setIsSubmitOpen(false);
      resetDeliverables();
      await loadContract();
    } catch (e) {
      alert("Submission failed: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onReviewSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contractService.submitReview(contract.id, "freelancer", {
        rating: data.rating,
        comment: data.comment
      });
      setIsReviewOpen(false);
      await loadContract();
    } catch (e) {
      alert("Failed to submit review: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEscalateDispute = async () => {
    if (window.confirm("Are you sure you want to escalate this contract to a dispute? An Admin will audit all assets. Your escrow payment remains locked until resolution.")) {
      setSubmitting(true);
      try {
        await contractService.escalateDispute(contract.id);
        await loadContract();
      } catch (e) {
        alert("Escalation failed: " + e.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "blue";
      case "review": return "orange";
      case "completed": return "green";
      case "disputed": return "red";
      default: return "gray";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-905 border border-gray-150 dark:border-gray-850 rounded-2xl">
        <p className="text-red-500 font-medium mb-4">Contract not found</p>
        <Link to="/freelancer/contracts" className="text-xs text-accent font-bold hover:underline">
          Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header back navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/freelancer/contracts"
          className="p-2 border border-gray-150 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-855 text-gray-500 dark:text-gray-450 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Contract workspace</h2>
          <p className="text-xs text-gray-400">Complete milestones, upload deliverables, and coordinate client releases</p>
        </div>
      </div>

      {/* Grid details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <Badge variant={getStatusColor(contract.status)}>
                {contract.status.toUpperCase()}
              </Badge>
              <span className="text-xxs text-gray-400 font-medium">
                Started: {new Date(contract.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {contract.projectTitle}
            </h3>

            <div className="flex items-center gap-2 mb-6 text-xs text-gray-550 dark:text-gray-400">
              <span>Client Owner:</span>
              <span className="font-bold text-gray-900 dark:text-white">{contract.clientName}</span>
              <Link to={`/freelancer/chat?userId=${contract.clientId}`} className="text-accent hover:underline flex items-center gap-0.5 ml-2 font-bold">
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl mb-6">
              <div>
                <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider">Escrow Payout</span>
                <span className="text-base font-bold text-gray-955 dark:text-white flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  {contract.amount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider">Allocated terms</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-1.5" />
                  {contract.duration} Days
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-550" />
              <span>Milestone payment is funded in GigSphere Escrow.</span>
            </div>
          </div>

          {/* Submission and delivery card */}
          {contract.status === "active" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Submit Deliverables</h3>
              <p className="text-xs text-gray-505">
                Ready to deliver the milestones? Upload your repository credentials and work description.
              </p>

              {contract.revisionRequest && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 rounded-xl text-xs">
                  <p className="font-bold flex items-center gap-1 mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    Client Revision Demands:
                  </p>
                  "{contract.revisionRequest}"
                </div>
              )}

              <Button variant="accent" onClick={() => setIsSubmitOpen(true)}>
                Deliver Milestone Work
              </Button>
            </div>
          )}

          {/* Pending client review card */}
          {contract.status === "review" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium flex gap-4 items-start">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/25 rounded-2xl text-amber-550 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-950 dark:text-white">Awaiting Client Approval</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Your work logs have been submitted. Client review is pending. Funds remain safe in Escrow until client approval or revision requests.
                </p>
                <div className="flex gap-2.5 pt-3">
                  <Button variant="danger" size="sm" onClick={onEscalateDispute}>
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Open Dispute
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Dispute ongoing details */}
          {contract.status === "disputed" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-premium flex gap-4 items-start">
              <div className="p-3 bg-red-50 text-red-500 dark:bg-red-950/20 rounded-2xl shrink-0 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-955 dark:text-white">Admin Dispute Assigned</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  The contract is under dispute audits. System administrators will evaluate code deliverables and details to publish split resolutions.
                </p>
              </div>
            </div>
          )}

          {/* Completed reviews */}
          {contract.status === "completed" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Milestone Released
              </h3>

              {contract.reviewFromFreelancer ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Your review for {contract.clientName}:</span>
                    <div className="flex text-amber-500 items-center gap-0.5 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {contract.reviewFromFreelancer.rating}/5
                    </div>
                  </div>
                  <p className="italic text-gray-650 dark:text-gray-400">"{contract.reviewFromFreelancer.comment}"</p>
                </div>
              ) : (
                <div className="p-4 border border-gray-150 dark:border-gray-800 rounded-xl text-center space-y-3">
                  <p className="text-xs text-gray-500">Provide feedback reviews for the client.</p>
                  <Button size="sm" onClick={() => setIsReviewOpen(true)}>
                    Write Client Review
                  </Button>
                </div>
              )}

              {contract.reviewFromClient && (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Client's review for you:</span>
                    <div className="flex text-amber-500 items-center gap-0.5 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {contract.reviewFromClient.rating}/5
                    </div>
                  </div>
                  <p className="italic text-gray-650 dark:text-gray-400">"{contract.reviewFromClient.comment}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar help */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
            <h4 className="text-sm font-bold text-gray-905 dark:text-white">Resolution Settle</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              If client communications break down or specifications aren't respected, you can file a formal Dispute. Administrators will audit assets to allocate wallet credits.
            </p>
          </div>
        </div>

      </div>

      {/* Deliverable submission Modal */}
      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Submit Milestone Deliverables">
        <form onSubmit={handleDeliverablesSubmit(onDeliver)} className="space-y-4">
          <Input
            label="GitHub Repository URL"
            placeholder="https://github.com/profile/repo"
            error={errors.githubLink}
            {...registerDeliverables("githubLink", {
              pattern: { value: /^https?:\/\/(www\.)?github\.com\/.+/i, message: "Must be a valid GitHub Repository link" }
            })}
          />

          <Input
            label="Live Demonstration Link"
            placeholder="https://demo-app.vercel.app"
            error={errors.liveDemoLink}
            {...registerDeliverables("liveDemoLink", {
              pattern: { value: /^https?:\/\/.+/i, message: "Must be a valid live link" }
            })}
          />

          <Textarea
            label="Work Summary & Release Notes"
            placeholder="Describe what features, frameworks, or databases you configured. Let the client know how to run tests..."
            rows={5}
            {...registerDeliverables("description", { required: "Work description is required" })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setIsSubmitOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Deliverables"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Client Feedback review Modal */}
      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Review Client Experience">
        <form onSubmit={handleReviewSubmit(onReviewSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Rating score</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating("rating", star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-8 h-8 ${
                    star <= ratingVal 
                      ? "text-amber-500 fill-current" 
                      : "text-gray-205 dark:text-gray-750"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Client Cooperation testimony"
            placeholder="Write details regarding instructions clarity, communications, and project feedback..."
            {...registerReview("comment", { required: "Comment is required" })}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsReviewOpen(false)}>
              Skip
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Save Feedback"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
