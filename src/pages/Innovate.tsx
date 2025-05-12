
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, FileText, Layout, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Innovate: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Lightbulb size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">INNOVATE Zone</h1>
            <p className="text-gray-400">
              Learn from interventions, adapt strategies, and develop new approaches
            </p>
          </div>
        </div>
      </header>
      
      <Tabs defaultValue="lessons" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="lessons"
            className={`text-sm font-medium py-3 ${
              activeTab === 'lessons' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <FileText size={16} className="mr-2" />
            Lessons Hub
          </TabsTrigger>
          <TabsTrigger
            value="blueprints"
            className={`text-sm font-medium py-3 ${
              activeTab === 'blueprints' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Layout size={16} className="mr-2" />
            Blueprint Console
          </TabsTrigger>
          <TabsTrigger
            value="retrospective"
            className={`text-sm font-medium py-3 ${
              activeTab === 'retrospective' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Activity size={16} className="mr-2" />
            Foresight Retrospective
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-4 text-left">Capture Lesson</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter lesson title" 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">Description</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm h-28 resize-none"
                    placeholder="Describe what was learned..." 
                  ></textarea>
                </div>
                
                <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm">
                  Save Lesson
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-4 text-left flex justify-between items-center">
                  <span>Lessons Library</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                    10 lessons
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 cursor-pointer transition-colors">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Lesson Title {i}</h3>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                        This is a brief description of what was learned from this particular intervention or strategy...
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Added 3 days ago</span>
                        <span>Health sector</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View All Lessons
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="blueprints" className="mt-0">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-6 text-left">Blueprint Console</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3 text-left">Active Blueprints</h3>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 cursor-pointer">
                        <h4 className="font-medium text-sm mb-2">Blueprint {i}</h4>
                        <div className="flex space-x-2 mb-3">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Education</span>
                          <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Tier 2</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full">
                          <div className="h-1 bg-purple-500 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Progress: 60%</span>
                          <span>Updated 2 days ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3 text-left">Parameter Tuning</h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Intensity</span>
                          <span>60%</span>
                        </div>
                        <input type="range" className="w-full" value="60" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Duration</span>
                          <span>24 weeks</span>
                        </div>
                        <input type="range" className="w-full" value="24" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Integration</span>
                          <span>75%</span>
                        </div>
                        <input type="range" className="w-full" value="75" />
                      </div>
                      
                      <button className="w-full py-2 mt-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm">
                        Simulate Band Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3 text-left">Blueprint Sandbox</h3>
                <div className="h-64 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10">
                  <p className="text-gray-400">Interactive Blueprint Simulator</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="retrospective" className="mt-0">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-6 text-left">Foresight Retrospective</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3 text-left">Scenario Gallery</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 cursor-pointer transition-colors">
                      <h4 className="font-medium mb-1">Scenario {i}</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        Brief description of the scenario parameters and constraints...
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex space-x-2">
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Health</span>
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Economic</span>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3 text-left">Breach Analysis</h3>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-400">Breach-count Chart</p>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-1 rounded-full ${i === 0 ? 'bg-purple-400' : 'bg-white/10'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
};

export default Innovate;
