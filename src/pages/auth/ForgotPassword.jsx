import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "" }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await authService.requestPasswordReset(data.email);
      setSuccessMsg("Reset code generated! Redirecting to OTP Verification...");
      // Simulate sending OTP, wait 1.5 seconds then navigate
      setTimeout(() => {
        navigate(`/otp-verification?email=${encodeURIComponent(data.email)}`);
      }, 1500);
    } catch (e) {
      setErrorMsg(e.message || "Email address not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Forgot Password</h3>
        <p className="text-xs text-gray-400">Enter your email to receive an OTP verification code</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Registered Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />

        <Button
          type="submit"
          className="w-full py-2.5 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Requesting OTP..." : "Send Verification Code"}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs">
        <Link to="/login" className="text-primary hover:underline font-semibold">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
