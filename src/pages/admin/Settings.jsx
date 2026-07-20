import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle } from "lucide-react";

export const AdminSettings = () => {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      commission: 10,
      disputeMode: "auto",
      maintenance: "false"
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      await updateProfile({ name: data.name });
      setSuccess("Administrative configuration parameters saved!");
    } catch (e) {
      setError(e.message || "Failed to update admin profile");
    } finally {
      setSubmitting(false);
    }
  };

  const disputeOptions = [
    { label: "Automatic mediation threshold", value: "auto" },
    { label: "Manual supervisor assign only", value: "manual" }
  ];

  const maintenanceOptions = [
    { label: "Disabled (Platform Active)", value: "false" },
    { label: "Enabled (Lock all endpoints)", value: "true" }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin System Settings</h2>
        <p className="text-xs text-gray-400">Configure marketplace parameters, fee structures, and profile overrides</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
        
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-550 shrink-0" />
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
              className="w-16 h-16 rounded-2xl object-cover border border-gray-250 dark:border-gray-850"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{user.name}</h4>
              <p className="text-xxs text-gray-400 font-semibold uppercase mt-0.5">Platform Executive profile</p>
            </div>
          </div>

          <Input
            label="Super Administrator Name"
            error={errors.name}
            {...register("name", { required: "Admin name is required" })}
          />

          <Input
            label="Marketplace Commission (%)"
            type="number"
            placeholder="10"
            error={errors.commission}
            {...register("commission", {
              required: "Commission size is required",
              min: { value: 0, message: "Commission cannot be negative" },
              max: { value: 100, message: "Commission cannot exceed 100%" }
            })}
          />

          <Select
            label="Dispute Mediation Assignment"
            options={disputeOptions}
            {...register("disputeMode")}
          />

          <Select
            label="System Maintenance Lock"
            options={maintenanceOptions}
            {...register("maintenance")}
          />

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button type="submit" disabled={submitting} className="bg-rose-600 hover:bg-rose-700">
              {submitting ? "Applying Changes..." : "Save System Changes"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
