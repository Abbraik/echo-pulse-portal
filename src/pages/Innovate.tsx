
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Layout, Activity, Calendar, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

const Innovate: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blueprintConsole');
  const { t } = useTranslation();

  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Lightbulb size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">{t('innovateZoneTitle')}</h1>
            <p className="text-gray-400">
              {t('innovateZoneDesc')}
            </p>
          </div>
        </div>
      </header>
      
      <Tabs defaultValue="blueprintConsole" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger
            value="blueprintConsole"
            className={`text-sm font-medium py-3 ${
              activeTab === 'blueprintConsole' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Layout size={16} className="mr-2" />
            {t('blueprintConsole')}
          </TabsTrigger>
          <TabsTrigger
            value="sandboxLab"
            className={`text-sm font-medium py-3 ${
              activeTab === 'sandboxLab' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Activity size={16} className="mr-2" />
            {t('sandboxLab')}
          </TabsTrigger>
          <TabsTrigger
            value="playbookLibrary"
            className={`text-sm font-medium py-3 ${
              activeTab === 'playbookLibrary' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Layout size={16} className="mr-2" />
            {t('playbookLibrary')}
          </TabsTrigger>
          <TabsTrigger
            value="scheduledSprints"
            className={`text-sm font-medium py-3 ${
              activeTab === 'scheduledSprints' ? 'bg-purple-500/30 text-purple-300' : ''
            }`}
          >
            <Calendar size={16} className="mr-2" />
            {t('scheduledSprints')}
          </TabsTrigger>
        </TabsList>
        
        {/* Blueprint Console Content */}
        <TabsContent value="blueprintConsole" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-6 text-left">{t('parameterEditor')}</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('intensity')}</span>
                      <span>60%</span>
                    </div>
                    <input type="range" className="w-full" value="60" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('duration')}</span>
                      <span>24 weeks</span>
                    </div>
                    <input type="range" className="w-full" value="24" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>4 weeks</span>
                      <span>52 weeks</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('integration')}</span>
                      <span>75%</span>
                    </div>
                    <input type="range" className="w-full" value="75" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Isolated</span>
                      <span>Fully Integrated</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-md font-medium mb-3 text-left">{t('miniSimPreviews')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-48">
                      <h4 className="text-sm font-medium mb-2">NDI Impact Projection</h4>
                      <div className="h-28 bg-white/5 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-teal-400">+2.8</p>
                          <p className="text-xs text-gray-500">estimated points</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-48">
                      <h4 className="text-sm font-medium mb-2">Implementation Timeline</h4>
                      <div className="h-28 bg-white/5 rounded-lg flex items-center justify-center">
                        <div className="w-full h-full p-2 relative">
                          {/* Timeline visualization */}
                          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20"></div>
                          <div className="absolute left-[10%] top-1/2 h-3 w-3 rounded-full bg-purple-500 transform -translate-y-1/2"></div>
                          <div className="absolute left-[40%] top-1/2 h-3 w-3 rounded-full bg-purple-500 transform -translate-y-1/2"></div>
                          <div className="absolute left-[70%] top-1/2 h-3 w-3 rounded-full bg-purple-500 transform -translate-y-1/2"></div>
                          <div className="absolute left-[90%] top-1/2 h-3 w-3 rounded-full bg-purple-500 transform -translate-y-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <span>Reset Parameters</span>
                  </Button>
                  <div className="space-x-2">
                    <Button variant="secondary">{t('saveAsPlaybook')}</Button>
                    <Button className="bg-purple-600 hover:bg-purple-500">{t('runSimulation')}</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-4 text-left">{t('activeBlueprints')}</h2>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 cursor-pointer">
                      <h4 className="font-medium text-sm mb-2">Water Conservation Blueprint {i}</h4>
                      <div className="flex space-x-2 mb-3">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Resource</span>
                        <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Tier 2</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full">
                        <div className="h-1 bg-purple-500 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>{t('progress')}: 60%</span>
                        <span>Updated 2 days ago</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-2 mt-4 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:bg-white/5 flex items-center justify-center space-x-2">
                  <Lightbulb size={16} />
                  <span>Create New Blueprint</span>
                </button>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-3 text-left">{t('publishToLibrary')}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    After thorough testing and validation, publish your blueprint to the library for wider use.
                  </p>
                  <Button variant="outline" className="w-full">Publish Selected Blueprint</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Sandbox Lab Content */}
        <TabsContent value="sandboxLab" className="mt-0">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-left">{t('sandboxLab')}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs">Mode:</span>
                <div className="flex">
                  <button className="px-3 py-1 text-xs bg-white/10 rounded-l-lg border border-white/10">
                    {t('nonExpertMode')}
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-500/30 rounded-r-lg border border-purple-400/30">
                    {t('expertMode')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative h-96 bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10 mb-4">
                  <div className="absolute inset-0 p-4">
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Add Node
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Add Connection
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Delete
                      </Button>
                    </div>
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-400">Drag-and-Tune CLD Canvas</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">{t('batchSweeps')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Parameter A</span>
                        <span>5 - 10</span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Parameter B</span>
                        <span>0 - 100</span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Iterations</span>
                        <span>500</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                      Configure Sweep
                    </Button>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">{t('monteCarlo')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Distribution</span>
                        <span>Normal</span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Confidence Interval</span>
                        <span>95%</span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Runs</span>
                        <span>1000</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">{t('templateLibrary')}</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[
                      'Water Usage Model',
                      'Population Growth',
                      'Economic Impact',
                      'Resource Distribution',
                      'Social Trust Framework',
                      'Energy Consumption'
                    ].map(template => (
                      <div key={template} className="flex items-center justify-between p-1 hover:bg-white/10 rounded">
                        <span className="text-xs">{template}</span>
                        <button className="text-xs text-purple-400">Use</button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">{t('impactDashboard')}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>NDI Impact</span>
                        <span className="text-teal-400">+3.2 pts</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full">
                        <div className="h-1.5 bg-teal-500 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Resource Utilization</span>
                        <span className="text-amber-400">-8%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full">
                        <div className="h-1.5 bg-amber-500 rounded-full" style={{width: '40%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Implementation Cost</span>
                        <span className="text-red-400">High</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full">
                        <div className="h-1.5 bg-red-500 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Community Acceptance</span>
                        <span className="text-green-400">Favorable</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full">
                        <div className="h-1.5 bg-green-500 rounded-full" style={{width: '70%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 mt-4 bg-white/5 hover:bg-white/10 rounded text-xs">
                    {t('compareWithBaseline')}
                  </button>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    {t('saveBlueprint')}
                  </Button>
                  <Button className="flex-1 text-xs bg-purple-600 hover:bg-purple-500">
                    Export Results
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Playbook Library Content */}
        <TabsContent value="playbookLibrary" className="mt-0">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-6 text-left">{t('playbookLibrary')}</h2>
            
            <div className="mb-6">
              <div className="relative mb-4">
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2"
                  placeholder="Search playbooks..." 
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Layout size={18} className="text-gray-500" />
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                <button className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs whitespace-nowrap">
                  All Categories
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                  Water
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                  Energy
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                  Transportation
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                  Social
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                  Economic
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-move group">
                  <div className="h-32 bg-gradient-to-br from-purple-900/30 to-blue-900/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Layout size={32} className="text-purple-300/50" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">v{i}.0</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">Water Conservation Strategy {i}</h3>
                      <div className="flex space-x-1">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                          {i % 2 === 0 ? 'Verified' : 'Popular'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      This playbook provides a comprehensive approach to water conservation through pricing strategies, education campaigns, and infrastructure upgrades.
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Used 24 times</span>
                      <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('dragToInstantiate')} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
                <span>Load More Playbooks</span>
              </button>
            </div>
          </div>
        </TabsContent>
        
        {/* Scheduled Sprints Content */}
        <TabsContent value="scheduledSprints" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-6 text-left">{t('learningSprints')}</h2>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-md">Upcoming Sprint: Water Policy Review</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        A focused session to review water conservation policies and their effectiveness.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm">June 15, 2025</span>
                      <span className="block text-xs text-gray-500 mt-1">10:00 AM - 12:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium mb-2">Participants (6)</h4>
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-xs">
                            U{i}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium mb-2">Meeting Link</h4>
                      <button className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded flex items-center space-x-2">
                        <span>Join Teams Meeting</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">View Materials</Button>
                    <Button variant="outline" size="sm">Add to Calendar</Button>
                  </div>
                </div>
                
                <div className="relative h-80 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="absolute inset-0 p-4">
                    <h3 className="text-md font-medium mb-2">Sprint Calendar</h3>
                    <div className="flex justify-center items-center h-[90%]">
                      <p className="text-gray-400">Calendar View with Scheduled Sprints</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-500">
                  Schedule New Sprint
                </Button>
              </div>
            </div>
            
            <div>
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{t('aiCoach')}</h3>
                  <Bot size={18} className="text-purple-400" />
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-96 flex flex-col">
                  <div className="flex-grow space-y-4 overflow-y-auto mb-4">
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">I've analyzed your last sprint and noticed some insights about water policy effectiveness.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-purple-500/20 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Can you summarize the key findings?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">The tiered pricing model showed a 15% reduction in usage for high-consumption households, but education campaigns had limited impact in rural areas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-sm"
                      placeholder="Ask AI Coach..." 
                    />
                    <button className="absolute right-2 top-2 text-purple-400 hover:text-purple-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium mb-2">Quick Prompts</h4>
                  <button className="w-full text-left text-xs bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 rounded">
                    Summarize my blueprint's potential impact
                  </button>
                  <button className="w-full text-left text-xs bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 rounded">
                    Generate implementation roadmap
                  </button>
                  <button className="w-full text-left text-xs bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 rounded">
                    Identify potential risks and mitigation strategies
                  </button>
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
