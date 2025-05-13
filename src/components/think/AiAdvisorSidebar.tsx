
import React from 'react';
import { HelpCircle, Zap, BrainCircuit } from 'lucide-react';

interface AiAdvisorSidebarProps {
  className?: string;
}

const AiAdvisorSidebar: React.FC<AiAdvisorSidebarProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <BrainCircuit size={16} className="text-teal-400 mr-1.5" />
          <h3 className="text-sm font-semibold text-teal-400">AI ADVISOR</h3>
        </div>
        <button className="p-1 rounded bg-teal-500/20 text-teal-400 hover:bg-teal-500/30">
          <HelpCircle size={16} />
        </button>
      </div>
      
      <div className="text-xs text-gray-300 bg-navy-800/60 p-3 rounded-lg border border-white/10 space-y-3">
        <div className="flex">
          <Zap size={16} className="text-teal-400 mr-1.5 shrink-0 mt-0.5" />
          <p>I notice the Population Dynamics pillar is nearing equilibrium. Consider focusing on Social Outcomes, which show a -12% deviation.</p>
        </div>
        
        <div className="flex">
          <Zap size={16} className="text-teal-400 mr-1.5 shrink-0 mt-0.5" />
          <p>To improve equilibrium bands, try adjusting the Resource-Market Efficiency min/max values to [65-80].</p>
        </div>
        
        <div className="flex">
          <Zap size={16} className="text-teal-400 mr-1.5 shrink-0 mt-0.5" />
          <p>Water Tariff has the highest sensitivity impact. Consider this as your primary leverage point.</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <h4 className="text-xs text-gray-400">Quick Navigation</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="text-xs bg-white/5 hover:bg-white/10 transition-colors rounded p-1.5 text-left">System Framing</button>
          <button className="text-xs bg-white/5 hover:bg-white/10 transition-colors rounded p-1.5 text-left">DEI & Foresight</button>
          <button className="text-xs bg-white/5 hover:bg-white/10 transition-colors rounded p-1.5 text-left">Equilibrium</button>
          <button className="text-xs bg-white/5 hover:bg-white/10 transition-colors rounded p-1.5 text-left">Strategy</button>
        </div>
      </div>
    </div>
  );
};

export default AiAdvisorSidebar;
