
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layout } from 'lucide-react';

const Think: React.FC = () => {
  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <Layout size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">THINK Zone</h1>
            <p className="text-gray-400">
              Analyze systems, model relationships, and identify patterns
            </p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-left">System Framing Studio</h2>
          <div className="aspect-video bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
            <p className="text-gray-400">Interactive System Map</p>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">2D View</button>
              <button className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">3D View</button>
            </div>
            <div>
              <button className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">Save</button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="glass-panel p-6 flex-grow">
            <h2 className="text-xl font-semibold mb-4 text-left">DEI & Foresight</h2>
            <div className="h-48 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
              <p className="text-gray-400">Charts</p>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 text-left">Equilibrium Solver</h2>
            <div className="h-32 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
              <p className="text-gray-400">Analysis Tools</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Think;
