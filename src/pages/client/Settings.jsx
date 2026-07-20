import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Input, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle } from "lucide-react";

export const ClientSettings = () => {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      company: user.company || "",
      title: user.title || "",
      bio: user.bio || ""
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      await updateProfile(data);
      setSuccess("Profile settings updated successfully!");
    } catch (e) {
      setError(e.message || "Failed to update profile settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Settings</h2>
        <p className="text-xs text-gray-400">Configure your workspace name, company parameters, and profile details</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
        
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-800"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{user.name}</h4>
              <p className="text-xxs text-gray-400 font-semibold uppercase mt-0.5">Workspace client profile</p>
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="Alex Rivera"
            error={errors.name}
            {...register("name", { required: "Name is required" })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="Apex Tech Solutions"
              error={errors.company}
              {...register("company")}
            />
            <Input
              label="Work Title"
              placeholder="Product Director"
              error={errors.title}
              {...register("title")}
            />
          </div>

          <Textarea
            label="Professional Bio"
            placeholder="Write a brief overview of your business or requirements..."
            rows={5}
            error={errors.bio}
            {...register("bio")}
          />

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving Changes..." : "Save Workspace Changes"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
