
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Monitor, BarChart2, AlertTriangle, Map } from 'lucide-react';
import Gauge from '@/components/ui/custom/Gauge';

const MonitorPage: React.FC = () => {
  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Monitor size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">MONITOR Zone</h1>
            <p className="text-gray-400">
              Track metrics, spot trends, and receive alerts about dynamics
            </p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
            {/* Replace Gauge icon with actual Lucide icon */}
            <Monitor size={18} className="mr-2 text-amber-500" />
            Overview Gauges
          </h2>
          <div className="space-y-4">
            {[
              { value: 78, label: "Metric 1", color: "amber" },
              { value: 64, label: "Metric 2", color: "amber" },
              { value: 89, label: "Metric 3", color: "amber" }
            ].map((metric, i) => (
              <div key={i} className="p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="flex items-center">
                  <div className="w-24 flex justify-center">
                    <Gauge 
                      value={metric.value} 
                      size="sm" 
                      label={metric.label}
                      color="amber" 
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{metric.label}</h3>
                      <span className="text-amber-400 text-sm font-bold">{metric.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full mt-1">
                      <div 
                        className="h-1 bg-amber-500 rounded-full" 
                        style={{width: `${metric.value}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
            <BarChart2 size={18} className="mr-2 text-amber-500" />
            Trend Panels
          </h2>
          <div className="h-64 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
            <p className="text-gray-400">Interactive Charts</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center">
              View Details
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div>
          <div className="glass-panel p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
              <AlertTriangle size={18} className="mr-2 text-amber-500" />
              Alerts Hub
            </h2>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="flex items-start">
                    <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 mr-2">
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Alert Title {i}</h3>
                      <p className="text-xs text-gray-400">12 minutes ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
              <Map size={18} className="mr-2 text-amber-500" />
              Coordination Heatmap
            </h2>
            <div className="h-44 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
              <p className="text-gray-400">Matrix View</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center">
          Go to INNOVATE Zone
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </AnimatedPage>
  );
};

export default MonitorPage;
