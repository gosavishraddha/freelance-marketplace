import React from "react";
import { Star } from "lucide-react";

export const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white text-sm">
              {review.reviewerName}
            </h5>
            <span className="text-xxs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider block">
              Project: {review.projectTitle}
            </span>
          </div>
          
          <div className="flex items-center text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded font-bold">
            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
            {review.rating.toFixed(1)}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed italic mb-2">
          "{review.comment}"
        </p>
      </div>

      <div className="text-right mt-2">
        <span className="text-xxs text-gray-400 dark:text-gray-500 font-medium">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          })}
        </span>
      </div>
    </div>
  );
};
