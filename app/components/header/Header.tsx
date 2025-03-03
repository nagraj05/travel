"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "../modal/Modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/useStore";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(session?.user || null);
      }
    };
    fetchSession();
  }, [setUser]);

  const handleOpen = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center p-2 h-16">
      <h3 className="text-2xl font-bold">Explore</h3>
      <div className="flex gap-2">
        <>
          <Button
            onClick={() => handleOpen("login")}
            className="cursor-pointer"
          >
            Login
          </Button>
          <Button
            variant={"outline"}
            onClick={() => handleOpen("signup")}
            className="cursor-pointer"
          >
            Signup
          </Button>
        </>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={activeTab === "login" ? "Login" : "Signup"}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="cursor-pointer">
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login onSuccess={() => setIsOpen(false)} />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </Modal>
    </div>
  );
}
