
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import DirectorGeneralDashboard from '@/pages/DirectorGeneralDashboard';
import SecretaryGeneralDashboard from '@/pages/SecretaryGeneralDashboard';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<DirectorGeneralDashboard />} />
              <Route path="/director-general" element={<DirectorGeneralDashboard />} />
              <Route path="/secretary-general" element={<SecretaryGeneralDashboard />} />
            </Routes>
          </Router>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
