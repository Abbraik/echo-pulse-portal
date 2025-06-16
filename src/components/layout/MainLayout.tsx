
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onLogout={handleLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
