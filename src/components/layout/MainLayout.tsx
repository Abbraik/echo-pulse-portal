
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PulseBar } from "./PulseBar";

const MainLayout = () => {
  const { signOut } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut();
  };

  const handlePulseBarFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    console.log('Filter clicked:', filter);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onLogout={handleLogout} />
      <PulseBar onFilterClick={handlePulseBarFilter} />
      <main className="flex-1 pt-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
