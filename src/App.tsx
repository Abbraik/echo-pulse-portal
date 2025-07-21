
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './hooks/use-theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import Think from './pages/Think'
import Act from './pages/Act'
import Monitor from './pages/Monitor'
import Innovate from './pages/Innovate'
import Learn from './pages/Learn'
import HomePage from './pages/HomePage'
import ClaimantPage from './pages/ClaimantPage'
import SecretaryGeneralDashboard from './pages/SecretaryGeneralDashboard'
import { DemoProvider } from './hooks/use-demo'
import { DemoSystem } from '@/components/demo/DemoSystem'
import Navbar from './components/layout/Navbar'
import { FeatureFlagsProvider, useFeatureFlags } from './hooks/use-feature-flags'
import RgsUIShell from './rgs-ui/shell'

const AppContent: React.FC = () => {
  const { flags } = useFeatureFlags();
  const queryClient = new QueryClient();

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AnimatePresence mode="wait">
                {flags.newRgsUI ? (
                  <motion.div
                    key="new-ui"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <RgsUIShell />
                  </motion.div>
                ) : (
                  <motion.div
                    key="legacy-ui"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                      <Navbar onLogout={handleLogout} />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/think" element={<Think />} />
                        <Route path="/act" element={<Act />} />
                        <Route path="/monitor" element={<Monitor />} />
                        <Route path="/innovate" element={<Innovate />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/claims" element={<ClaimantPage />} />
                        <Route path="/sg" element={<SecretaryGeneralDashboard />} />
                      </Routes>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <DemoSystem />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </DemoProvider>
    </QueryClientProvider>
  );
};

function App() {
  return (
    <FeatureFlagsProvider>
      <AppContent />
    </FeatureFlagsProvider>
  );
}

export default App;
