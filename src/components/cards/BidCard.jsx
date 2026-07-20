import React from "react";
import { Star, Clock, DollarSign, Check, X, MessageSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const BidCard = ({ bid, onAccept, onReject, showActions = true, isClient = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium flex flex-col md:flex-row justify-between gap-5"
    >
      <div className="flex-1 flex gap-4 items-start">
        <img
          src={bid.freelancerAvatar}
          alt={bid.freelancerName}
          className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h5 className="font-bold text-gray-900 dark:text-white">{bid.freelancerName}</h5>
            <span className="text-xs text-gray-500 dark:text-gray-400">({bid.freelancerTitle})</span>
            <div className="flex items-center text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded font-bold">
              <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
              {bid.freelancerRating}
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Bid submitted: {new Date(bid.createdAt).toLocaleDateString()}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-3">
            {bid.proposal}
          </p>
        </div>
      </div>

      {/* Bid Details & Actions */}
      <div className="flex flex-col justify-between items-end min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-850 pt-4 md:pt-0 md:pl-5">
        <div className="flex flex-col md:items-end w-full space-y-2 mb-4">
          <div className="flex justify-between md:justify-end items-center gap-3 w-full">
            <span className="text-xs text-gray-400 font-medium">Bid Amount:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="w-4 h-4 text-emerald-500 mr-0.5" />
              {bid.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between md:justify-end items-center gap-3 w-full">
            <span className="text-xs text-gray-400 font-medium">Duration:</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-450" />
              {bid.duration} Days
            </span>
          </div>
        </div>

        {showActions && isClient && bid.status === "pending" && (
          <div className="flex gap-2 w-full mt-auto">
            <Link
              to={`/client/chat?userId=${bid.freelancerId}`}
              className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-350 border border-gray-200 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </Link>
            <Button
              variant="danger"
              size="sm"
              className="px-2"
              onClick={() => onReject(bid.id)}
              title="Decline bid"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="accent"
              size="sm"
              className="px-4"
              onClick={() => onAccept(bid.id)}
            >
              <Check className="w-4 h-4 mr-1" />
              Hire
            </Button>
          </div>
        )}

        {bid.status !== "pending" && (
          <div className="w-full mt-auto text-right">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              bid.status === "accepted"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {bid.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
