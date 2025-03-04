"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/lib/stores/useLoginStore";
import { useStore } from "@/lib/useStore";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

type Inputs = {
  username: string;
  password: string;
};

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const setUser = useStore((state) => state.setUser);
  const setUsername = useStore((state) => state.setUsername);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, username")
        .eq("username", data.username)
        .single();

      if (profileError || !profile) {
        setErrorMessage("Username not found");
        toast.error("Username not found");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setUsername(profile.username);
        toast.success("Successfully logged in!");
        router.push("/Dashboard");
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" {...register("username")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            Logging in...
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
