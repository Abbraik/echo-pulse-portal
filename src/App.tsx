
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { DemoProvider } from './hooks/use-demo'
import { DemoSystem } from '@/components/demo/DemoSystem'
import Navbar from './components/layout/Navbar'

function App() {
  const queryClient = new QueryClient()

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Navbar onLogout={handleLogout} />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/think" element={<Think />} />
                  <Route path="/act" element={<Act />} />
                  <Route path="/monitor" element={<Monitor />} />
                  <Route path="/innovate" element={<Innovate />} />
                  <Route path="/learn" element={<Learn />} />
                </Routes>
              </div>
              <DemoSystem />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </DemoProvider>
    </QueryClientProvider>
  );
}

export default App;
