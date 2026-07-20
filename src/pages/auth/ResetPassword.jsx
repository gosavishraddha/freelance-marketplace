import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const passwordVal = watch("password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Settle request
      await authService.resetPassword(email, data.password);
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate(`/login`);
      }, 1500);
    } catch (e) {
      setErrorMsg(e.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Reset Password</h3>
        <p className="text-xs text-gray-400">Configure a secure new password for your account</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === passwordVal || "Passwords do not match"
          })}
        />

        <Button
          type="submit"
          className="w-full py-2.5 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
};
