
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import Think from "./pages/Think";
import Act from "./pages/Act";
import Learn from "./pages/Learn";
import Innovate from "./pages/Innovate";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedAuth = localStorage.getItem('pds-authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('pds-authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pds-authenticated');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pds-ui-theme">
        <LanguageProvider defaultLanguage="en" storageKey="pds-language">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                  <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Routes>
                    <Route path="/" element={<MainLayout onLogout={handleLogout} />}>
                      <Route index element={<HomePage />} />
                      <Route path="/think" element={<Think />} />
                      <Route path="/act" element={<Act />} />
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/innovate" element={<Innovate />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                )}
              </AnimatePresence>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
