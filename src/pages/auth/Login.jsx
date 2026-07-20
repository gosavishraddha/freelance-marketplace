import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Prepopulate standard demo accounts based on query param roles
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "client") {
      setValue("email", "client@example.com");
      setValue("password", "Password123");
    } else if (roleParam === "freelancer") {
      setValue("email", "freelancer@example.com");
      setValue("password", "Password123");
    } else if (roleParam === "admin") {
      setValue("email", "admin@example.com");
      setValue("password", "Password123");
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      const user = await login(data.email, data.password);
      
      // Save remember me email preference
      if (data.rememberMe) {
        localStorage.setItem("remembered_email", data.email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      // Navigate to user portal
      navigate(`/${user.role}/dashboard`);
    } catch (e) {
      setAuthError(e.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome Back</h3>
        <p className="text-xs text-gray-400">Sign in to manage your freelance contracts</p>
      </div>

      {authError && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="relative">
          <Input
            label="Email Address"
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
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-650 dark:text-gray-400">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[10px] text-primary hover:underline font-bold"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 border-gray-205 dark:border-gray-800 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", {
                required: "Password is required"
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 font-medium block mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Remember Me Toggle */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/30 cursor-pointer"
              {...register("rememberMe")}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Remember Me</span>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full py-2.5 mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Demo Credentials Alert Helper */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-xl text-xxs text-gray-500 dark:text-gray-450 space-y-1 leading-relaxed">
        <p className="font-bold text-gray-700 dark:text-gray-300">Quick Testing Profiles:</p>
        <p>• Client: <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">client@example.com</code> / <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">Password123</code></p>
        <p>• Freelancer: <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">freelancer@example.com</code> / <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">Password123</code></p>
        <p>• Admin: <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">admin@example.com</code> / <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-350">Password123</code></p>
      </div>

      <div className="mt-8 text-center text-xs">
        <p className="text-gray-500">
          Need an account?{" "}
          <Link to="/role-selection" className="text-primary hover:underline font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
