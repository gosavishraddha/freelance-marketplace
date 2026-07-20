import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle } from "lucide-react";

export const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [regError, setRegError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "freelancer"
    }
  });

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["client", "freelancer", "admin"].includes(roleParam)) {
      setValue("role", roleParam);
    }
  }, [searchParams, setValue]);

  const passwordVal = watch("password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setRegError("");
    try {
      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });
      // Redirect directly to login with registered role query
      navigate(`/login?role=${data.role}`);
    } catch (e) {
      setRegError(e.message || "Failed to register user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { label: "Freelancer (looking for projects)", value: "freelancer" },
    { label: "Client (looking to hire talent)", value: "client" },
    { label: "Administrator (monitoring platform)", value: "admin" }
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h3>
        <p className="text-xs text-gray-400">Join the premium remote work marketplace</p>
      </div>

      {regError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
          {regError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="Alex Rivera"
          error={errors.name}
          {...register("name", { required: "Full name is required" })}
        />

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

        <Select
          label="Account Role Type"
          options={roleOptions}
          error={errors.role}
          {...register("role", { required: "Role selection is required" })}
        />

        <Input
          label="Password"
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
          label="Confirm Password"
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
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
