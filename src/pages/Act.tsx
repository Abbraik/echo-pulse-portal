
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Activity } from 'lucide-react';

const Act: React.FC = () => {
  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
            <Activity size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">ACT Zone</h1>
            <p className="text-gray-400">
              Implement strategies, coordinate resources, and execute interventions
            </p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-left">Strategy Wizard</h2>
          <div className="space-y-6">
            <div className="flex justify-between mb-8">
              <div className="flex space-x-1">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">1</div>
                <div className="h-1 w-10 bg-teal-500 self-center"></div>
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">2</div>
                <div className="h-1 w-10 bg-white/10 self-center"></div>
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">3</div>
                <div className="h-1 w-10 bg-white/10 self-center"></div>
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">4</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Define Objectives</h3>
              <div className="space-y-4">
                {/* Just placeholders */}
                <div className="h-14 border border-white/10 rounded-lg bg-white/5 p-4"></div>
                <div className="h-14 border border-white/10 rounded-lg bg-white/5 p-4"></div>
                <div className="h-14 border border-white/10 rounded-lg bg-white/5 p-4"></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-left">Delivery & Coordination</h2>
          <div className="h-64 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
            <p className="text-gray-400">Gantt-Kanban Hybrid</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3 text-left">Rapid-Test Hub</h3>
            <div className="h-32 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
              <p className="text-gray-400">Test Console</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Act;
