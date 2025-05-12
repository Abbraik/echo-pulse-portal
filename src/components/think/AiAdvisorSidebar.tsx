
import React from 'react';

interface AiAdvisorSidebarProps {
  className?: string;
}

const AiAdvisorSidebar: React.FC<AiAdvisorSidebarProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-teal-400">AI ADVISOR</h3>
        <button className="p-1 rounded bg-teal-500/20 text-teal-400 hover:bg-teal-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </button>
      </div>
      <div className="text-xs text-gray-400 bg-navy-800/30 p-2 rounded-lg border border-white/10">
        I notice you're analyzing population dynamics. Consider adding demographic transitions as a key variable in your system model.
      </div>
    </div>
  );
};

export default AiAdvisorSidebar;
