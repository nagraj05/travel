"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/lib/stores/useSignupStore";
import { toast } from "react-toastify";
import { debounce } from "@/lib/utils/debounce";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "checking" | null
  >(null);
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const { setUsername, setEmail, setPassword, setConfirmPassword } =
    useSignupStore();

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus("checking");
    const { data: existingUser, error: lookupError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.trim())
      .single();

    setUsernameStatus(existingUser ? "taken" : "available");
  };

  const debouncedCheckUsername = debounce(checkUsername, 500);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (usernameStatus === "taken") {
      toast.error("Username already taken");
      return;
    }

    setLoading(true);
    setUsername(data.username);
    setEmail(data.email);
    setPassword(data.password);
    setConfirmPassword(data.confirmPassword);

    const { data: existingUser, error: lookupError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", data.username)
      .single();

    if (existingUser) {
      toast.error("Username already taken");
      setLoading(false);
      return;
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: data.username,
          email: data.email,
        },
      ]);

      if (profileError) {
        toast.error("Error creating profile: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    toast.success("Successfully registered!");
    router.push("/login");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            onChange: (e) => {
              const value = e.target.value;
              if (!value || value.length < 3) {
                setUsernameStatus(null);
              } else {
                debouncedCheckUsername(value);
              }
            },
          })}
        />
        {usernameStatus && watch("username")?.length > 3 && (
          <div className="text-xs px-2">
            {usernameStatus === "checking" && (
              <span className="text-gray-500">Checking availability...</span>
            )}
            {usernameStatus === "available" && (
              <span className="text-green-600">Username is available</span>
            )}
            {usernameStatus === "taken" && (
              <span className="text-red-600">Username is already taken!</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
          })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? <Loader className="h-4 w-4 animate-spin" /> : "Signup"}
      </Button>
    </form>
  );
}
