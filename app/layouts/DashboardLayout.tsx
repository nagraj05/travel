"use client";

import { ReactNode } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/Sidebar";
import { useStore } from "@/lib/useStore";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useStore((state) => state.user);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
} 