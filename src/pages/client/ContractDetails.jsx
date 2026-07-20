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
  ShieldAlert,
  ShieldCheck,
  GitBranch,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Star,
  CheckCircle2
} from "lucide-react";

export const ClientContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register: registerRevision, handleSubmit: handleRevisionSubmit, reset: resetRevision } = useForm();
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

  const onApprove = async () => {
    if (window.confirm("Are you sure you want to approve this work? This will release the escrow funds of $" + contract.amount + " directly to the freelancer's wallet. This action cannot be undone.")) {
      setSubmitting(true);
      try {
        await contractService.approveWork(contract.id);
        await loadContract();
        setIsReviewOpen(true); // Open review modal immediately upon approval
      } catch (e) {
        alert(e.message || "Failed to approve work");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onRevisionSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contractService.requestRevision(contract.id, data.feedback);
      setIsRevisionOpen(false);
      resetRevision();
      await loadContract();
    } catch (e) {
      alert(e.message || "Failed to submit revision");
    } finally {
      setSubmitting(false);
    }
  };

  const onReviewSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contractService.submitReview(contract.id, "client", {
        rating: data.rating,
        comment: data.comment
      });
      setIsReviewOpen(false);
      await loadContract();
    } catch (e) {
      alert(e.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const onEscalateDispute = async () => {
    if (window.confirm("Are you sure you want to escalate this contract to a dispute? An Administrator will review the terms and work submitted. Your escrow funds will remain locked in escrow until resolution.")) {
      setSubmitting(true);
      try {
        await contractService.escalateDispute(contract.id);
        await loadContract();
      } catch (e) {
        alert(e.message || "Failed to escalate dispute");
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
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
        <p className="text-red-500 font-medium mb-4">Contract not found</p>
        <Link to="/client/contracts" className="text-xs text-primary font-bold hover:underline">
          Return to contract lists
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header back navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/client/contracts"
          className="p-2 border border-gray-150 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Contract Management Hub</h2>
          <p className="text-xs text-gray-400">Review deliverables, fund milestones, release escrows, or resolve issues</p>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Milestones and deliverable details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Sheet */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <Badge variant={getStatusColor(contract.status)}>
                {contract.status.toUpperCase()}
              </Badge>
              <span className="text-xxs text-gray-400">
                Created: {new Date(contract.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {contract.projectTitle}
            </h3>

            <div className="flex items-center gap-2 mb-6 text-xs text-gray-550 dark:text-gray-400">
              <span>Freelancer:</span>
              <span className="font-bold text-gray-900 dark:text-white">{contract.freelancerName}</span>
              <Link to={`/client/chat?userId=${contract.freelancerId}`} className="text-primary hover:underline flex items-center gap-0.5 ml-2 font-bold">
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl mb-6">
              <div>
                <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider">Milestone Value</span>
                <span className="text-base font-bold text-gray-950 dark:text-white flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  {contract.amount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xxs text-gray-400 font-bold block uppercase tracking-wider">Duration Target</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-1.5" />
                  {contract.duration} Days
                </span>
              </div>
            </div>

            {/* Escrow Status Alert */}
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-705 dark:text-emerald-400 font-semibold mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Funds of ${contract.amount} are secure in GigSphere Escrow.</span>
            </div>
          </div>

          {/* Work Review Module */}
          {contract.status === "review" && contract.workSubmitted && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-105 dark:border-gray-850 shadow-premium space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Review Freelancer Deliverables</h3>
              <p className="text-xs text-gray-500">
                The freelancer has submitted work. Review the links and details below before approving.
              </p>

              {contract.workDesc && (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl text-xs leading-relaxed text-gray-650 dark:text-gray-400">
                  <p className="font-bold mb-1 text-gray-900 dark:text-white">Deliverable Notes:</p>
                  {contract.workDesc}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {contract.workGithub && (
                  <a
                    href={contract.workGithub}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    GitHub Repo
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                )}

                {contract.workDemo && (
                  <a
                    href={contract.workDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="accent"
                  onClick={onApprove}
                  disabled={submitting}
                >
                  Approve & Release Funds
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsRevisionOpen(true)}
                  disabled={submitting}
                >
                  Request Revision
                </Button>
                <Button
                  variant="danger"
                  onClick={onEscalateDispute}
                  disabled={submitting}
                  className="ml-auto"
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Escalate Dispute
                </Button>
              </div>
            </div>
          )}

          {/* Ongoing active instructions helper */}
          {contract.status === "active" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">Project Execution Ongoing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The freelancer is currently working. If they have questions, you can coordinate details inside the Chat Room. If they submit deliverables, you will receive an alert to review their files.
              </p>
              {contract.revisionRequest && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-850 dark:text-amber-400">
                  <p className="font-bold mb-1">Your requested revisions:</p>
                  "{contract.revisionRequest}"
                </div>
              )}
            </div>
          )}

          {/* Dispute ongoing panel */}
          {contract.status === "disputed" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-premium flex gap-4 items-start">
              <div className="p-3 bg-red-105 text-red-500 dark:bg-red-950/20 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-950 dark:text-white">Escrow Dispute Pending</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  An Administrator has been assigned to audit the contract deliverables and communication transcripts. Settle parameters will be published upon dispute resolution.
                </p>
              </div>
            </div>
          )}

          {/* Review results panel upon completion */}
          {contract.status === "completed" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Contract Completed
              </h3>
              
              {contract.reviewFromClient ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Your Feedback for {contract.freelancerName}:</span>
                    <div className="flex text-amber-500 font-bold items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {contract.reviewFromClient.rating}/5
                    </div>
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-400">"{contract.reviewFromClient.comment}"</p>
                </div>
              ) : (
                <div className="p-4 border border-gray-150 dark:border-gray-800 rounded-xl text-center space-y-3">
                  <p className="text-xs text-gray-500">You haven't left a feedback review for this contract yet.</p>
                  <Button size="sm" onClick={() => setIsReviewOpen(true)}>
                    Write Review
                  </Button>
                </div>
              )}

              {contract.reviewFromFreelancer && (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Freelancer's Feedback for you:</span>
                    <div className="flex text-amber-500 font-bold items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {contract.reviewFromFreelancer.rating}/5
                    </div>
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-400">"{contract.reviewFromFreelancer.comment}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar alerts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Escrow Safeguard</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your funds are held securely in the GigSphere Escrow wallet. We only release payment to the freelancer once you approve the submitted deliverables.
            </p>
          </div>
        </div>

      </div>

      {/* Revision Modal */}
      <Modal isOpen={isRevisionOpen} onClose={() => setIsRevisionOpen(false)} title="Request Revisions">
        <form onSubmit={handleRevisionSubmit(onRevisionSubmit)} className="space-y-4">
          <Textarea
            label="Provide Revision Feedback"
            placeholder="Explain clearly what changes, additions, or fixes are needed before payment release..."
            {...registerRevision("feedback", { required: "Feedback is required" })}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsRevisionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Revision Request"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Feedback Modal */}
      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Submit Feedback Review">
        <form onSubmit={handleReviewSubmit(onReviewSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Rating Score</label>
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
                      : "text-gray-200 dark:text-gray-750"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Comments & Testimony"
            placeholder="Describe your experience collaborating with this freelancer..."
            {...registerReview("comment", { required: "Testimony is required" })}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsReviewOpen(false)}>
              Skip Review
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Save Review"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
