
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import Think from "./pages/Think";
import Act from "./pages/Act";
import Learn from "./pages/Learn";
import Innovate from "./pages/Innovate";
import Monitor from "./pages/Monitor";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SecretaryGeneralDashboard from "./pages/SecretaryGeneralDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {!user ? (
          <Login />
        ) : (
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/think" element={<Think />} />
              <Route path="/act" element={<Act />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/innovate" element={<Innovate />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/secretary-general" element={<SecretaryGeneralDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pds-ui-theme">
        <LanguageProvider defaultLanguage="en" storageKey="pds-language">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
