import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from '@/components/ui/sonner';
import DirectorGeneralDashboard from '@/pages/DirectorGeneralDashboard';
import SecretaryGeneralDashboard from '@/pages/SecretaryGeneralDashboard';

function App() {
  return (
    <QueryClient>
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
    </QueryClient>
  );
}

export default App;
