
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';

const DirectorGeneralDashboard: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="glass-panel p-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white mb-4">
              Director General Dashboard
            </h1>
            <p className="text-slate-300 mb-6">
              This dashboard is being redesigned from scratch. Please check back soon for the new implementation.
            </p>
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DirectorGeneralDashboard;
