
import React from 'react';
import DirectorGeneralDashboard from './DirectorGeneralDashboard';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <div className="relative z-10">
        <DirectorGeneralDashboard />
      </div>
    </div>
  );
};

export default HomePage;
