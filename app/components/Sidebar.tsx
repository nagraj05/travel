"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/useStore";

export default function Sidebar() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleLogout = async () => {
    setUser(null);
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full w-64 p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <Button onClick={() => router.push("/dashboard")} className="mb-2">
        Dashboard
      </Button>
      <Button onClick={() => router.push("/profile")} className="mb-2">
        Profile
      </Button>
      <Button onClick={() => router.push("/settings")} className="mb-2">
        Settings
      </Button>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
} 