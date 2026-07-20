import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const OTPVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { otp: "" }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await authService.verifyOTP(email, data.otp);
      setSuccessMsg("OTP Verified! Redirecting to password reset...");
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.otp)}`);
      }, 1200);
    } catch (e) {
      setErrorMsg(e.message || "Invalid verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">OTP Verification</h3>
        <p className="text-xs text-gray-400">
          Enter the code sent to <span className="font-bold text-gray-700 dark:text-gray-300">{email}</span>
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Verification Code (OTP)"
          placeholder="123456"
          error={errors.otp}
          {...register("otp", {
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "OTP must be 6 digits"
            }
          })}
        />

        <Button
          type="submit"
          className="w-full py-2.5 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Didn't receive a code?</p>
        <button
          type="button"
          onClick={() => authService.requestPasswordReset(email)}
          className="text-primary hover:underline font-bold mt-1"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};
