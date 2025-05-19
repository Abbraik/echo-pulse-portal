
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { BookOpen, FileText, BarChart, FileSpreadsheet, Network, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

const Learn: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lessonsHub');
  const { t } = useTranslation();

  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <BookOpen size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">{t('learnZoneTitle')}</h1>
            <p className="text-gray-400">
              {t('learnZoneDesc')}
            </p>
          </div>
        </div>
      </header>
      
      <Tabs defaultValue="lessonsHub" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger
            value="lessonsHub"
            className={`text-sm font-medium py-3 ${
              activeTab === 'lessonsHub' ? 'bg-blue-500/30 text-blue-300' : ''
            }`}
          >
            <FileText size={16} className="mr-2" />
            {t('lessonsHub')}
          </TabsTrigger>
          <TabsTrigger
            value="rootCauseAnalysis"
            className={`text-sm font-medium py-3 ${
              activeTab === 'rootCauseAnalysis' ? 'bg-blue-500/30 text-blue-300' : ''
            }`}
          >
            <FileText size={16} className="mr-2" />
            {t('rootCauseAnalysis')}
          </TabsTrigger>
          <TabsTrigger
            value="retrospective"
            className={`text-sm font-medium py-3 ${
              activeTab === 'retrospective' ? 'bg-blue-500/30 text-blue-300' : ''
            }`}
          >
            <BarChart size={16} className="mr-2" />
            {t('retrospective')}
          </TabsTrigger>
          <TabsTrigger
            value="reportBuilder"
            className={`text-sm font-medium py-3 ${
              activeTab === 'reportBuilder' ? 'bg-blue-500/30 text-blue-300' : ''
            }`}
          >
            <FileSpreadsheet size={16} className="mr-2" />
            {t('reportBuilder')}
          </TabsTrigger>
          <TabsTrigger
            value="knowledgeMap"
            className={`text-sm font-medium py-3 ${
              activeTab === 'knowledgeMap' ? 'bg-blue-500/30 text-blue-300' : ''
            }`}
          >
            <Network size={16} className="mr-2" />
            {t('knowledgeMap')}
          </TabsTrigger>
        </TabsList>
        
        {/* Lessons Hub Content */}
        <TabsContent value="lessonsHub" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-4 text-left">{t('captureLesson')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('lessonTitle')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter lesson title" 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('lessonDesc')}</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm h-28 resize-none"
                    placeholder="Describe what was learned..." 
                  ></textarea>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('lessonSource')}</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option>Bundle Implementation</option>
                    <option>System Alert</option>
                    <option>Stakeholder Feedback</option>
                    <option>Monitoring Data</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('lessonImpact')}</label>
                  <div className="flex space-x-2">
                    {['Low', 'Medium', 'High'].map(level => (
                      <button 
                        key={level} 
                        className={`flex-1 py-1 px-3 rounded-lg text-xs ${
                          level === 'Medium' 
                            ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30' 
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                  {t('saveLesson')}
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-left">{t('lessonsLibrary')}</h2>
                  <div className="flex space-x-2 items-center">
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      24 {t('lessonCount')}
                    </span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                      <option>{t('all')}</option>
                      <option>{t('filterByDate')}</option>
                      <option>{t('filterByBundle')}</option>
                      <option>{t('filterByTag')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 cursor-pointer transition-colors">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Resource Optimization Insight {i}</h3>
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          {t('verified')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                        We learned that implementing a 3-tier pricing model for water usage resulted in a 12% reduction in consumption across residential areas...
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span>Added 3 days ago</span>
                          <span className="mx-2">•</span>
                          <span>Water sector</span>
                        </div>
                        <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                          High Impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All Lessons
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Root Cause Analysis Content */}
        <TabsContent value="rootCauseAnalysis" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-left">{t('fiveWhys')}</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Clear Form
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Save Analysis
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('event')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Describe the event or problem..." 
                  />
                </div>
                
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i}>
                    <label className="text-sm text-gray-300 block mb-1 text-left">{t(`why${i}`)}</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      placeholder={`Why did this happen? (Level ${i})...`}
                    />
                  </div>
                ))}
                
                <div>
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('lessonRecommendation')}</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm h-16 resize-none"
                    placeholder="Based on this analysis, what should be done?" 
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-left">{t('fishboneAnalysis')}</h2>
                <Button variant="outline" size="sm" className="text-xs">
                  View Example
                </Button>
              </div>
              
              <div className="relative h-80 bg-white/5 border border-white/10 rounded-lg mb-6 flex items-center justify-center">
                <div className="fishbone-diagram w-full h-full p-4 text-center">
                  <p className="text-gray-400">Interactive Fishbone Diagram</p>
                  <p className="text-xs text-gray-600 mt-2">Click on categories to add causes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <button key={i} className="py-1 px-2 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                    {t(`category${i}`)}
                  </button>
                ))}
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-500">
                Generate Analysis Report
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-4 text-left">AI Assistant</h2>
              <div className="flex space-x-4">
                <div className="flex-grow bg-white/5 border border-white/10 rounded-lg p-4 h-24 flex items-center justify-center text-gray-400">
                  <p>Based on your analysis, a similar event occurred 3 months ago. Would you like to see related lessons?</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="text-left px-4">
                    Show similar lessons
                  </Button>
                  <Button variant="outline" size="sm" className="text-left px-4">
                    Suggest root causes
                  </Button>
                  <Button variant="outline" size="sm" className="text-left px-4">
                    Draft recommendations
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Retrospective Gallery Content */}
        <TabsContent value="retrospective" className="mt-0">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-6 text-left">{t('retrospective')}</h2>
            
            <div className="relative h-64 mb-8 glass-panel-dark">
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">Q2 2025 Retrospective</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                      6 Breaches
                    </span>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                      12 Lessons
                    </span>
                  </div>
                </div>
                <div className="h-32 w-full flex items-end">
                  <div className="w-full h-24 bg-white/5 rounded-lg relative overflow-hidden">
                    {/* Simulated chart bars */}
                    <div className="absolute bottom-0 left-[10%] w-[5%] h-[40%] bg-amber-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[20%] w-[5%] h-[60%] bg-amber-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[30%] w-[5%] h-[30%] bg-amber-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5%] h-[80%] bg-red-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[50%] w-[5%] h-[50%] bg-amber-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[60%] w-[5%] h-[20%] bg-green-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5%] h-[40%] bg-amber-500/50 rounded-t"></div>
                    <div className="absolute bottom-0 left-[80%] w-[5%] h-[35%] bg-green-500/50 rounded-t"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">April - June 2025</span>
                  <Button variant="secondary" size="sm">Explore</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative h-40 glass-panel-dark hover:bg-white/5 cursor-pointer transition-all">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium">Q{4-i} 2024 Retrospective</h4>
                      <div className="flex space-x-2 mt-1">
                        <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full">
                          2 Breaches
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
                          8 Lessons
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-left">{t('timelineExplorer')}</h3>
              <div className="h-64 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Interactive Timeline Explorer</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Report Builder Content */}
        <TabsContent value="reportBuilder" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-6 text-left">{t('reportBuilder')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1 text-left">{t('selectDateRange')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full"
                      />
                      <input 
                        type="date" 
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-300 block mb-1 text-left">{t('reportFormat')}</label>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center space-x-2">
                        <FileText size={16} />
                        <span>{t('pdfFormat')}</span>
                      </button>
                      <button className="flex-1 py-2 bg-blue-500/30 border border-blue-400/30 rounded-lg text-sm flex items-center justify-center space-x-2">
                        <FileText size={16} />
                        <span>{t('pptxFormat')}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-sm text-gray-300 block mb-1 text-left">{t('emailDistribution')}</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-wrap gap-2">
                    {['team@example.com', 'manager@example.com'].map(email => (
                      <span key={email} className="bg-white/10 px-2 py-0.5 rounded text-xs flex items-center">
                        {email}
                        <button className="ml-1 text-gray-400 hover:text-gray-300">×</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      className="bg-transparent flex-grow min-w-[100px] outline-none text-sm" 
                      placeholder="Add email..."
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-sm text-gray-300 block mb-1 text-left">Report Sections</label>
                  <div className="space-y-2">
                    {[
                      'Executive Summary',
                      'Key Performance Indicators',
                      'Breach Analysis',
                      'Lesson Summaries',
                      'Recommendations',
                      'Appendix: Detailed Metrics'
                    ].map(section => (
                      <div key={section} className="flex items-center space-x-2">
                        <input type="checkbox" checked={true} className="rounded bg-white/5" />
                        <label className="text-sm">{section}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-500">{t('generateAndDownload')}</Button>
              </div>
            </div>
            
            <div>
              <div className="glass-panel p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-left">Report Preview</h2>
                <div className="h-80 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">Select options to preview report</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-4 text-left">Recent Reports</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Q1 2025 M&E Report', date: '2 weeks ago', format: 'PDF' },
                    { name: 'Annual Review 2024', date: '2 months ago', format: 'PowerPoint' },
                    { name: 'Pilot Project Evaluation', date: '3 months ago', format: 'PDF' }
                  ].map(report => (
                    <div key={report.name} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.date}</p>
                      </div>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                        {report.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Knowledge Map Content */}
        <TabsContent value="knowledgeMap" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-left">{t('knowledgeMap')}</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Zoom In
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Zoom Out
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Reset View
                    </Button>
                  </div>
                </div>
                
                <div className="relative h-[500px] bg-white/5 border border-white/10 rounded-lg mb-4 flex items-center justify-center">
                  <div className="knowledge-graph w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <p>Interactive Knowledge Graph Visualization</p>
                    </div>
                    
                    {/* Simulated graph nodes */}
                    <div className="absolute top-1/4 left-1/4 h-10 w-10 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center text-xs">
                      Lesson
                    </div>
                    <div className="absolute top-1/3 left-1/2 h-10 w-10 rounded-full bg-teal-500/30 border border-teal-500/50 flex items-center justify-center text-xs">
                      Playbook
                    </div>
                    <div className="absolute top-1/2 left-1/3 h-10 w-10 rounded-full bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-xs">
                      Tag
                    </div>
                    
                    {/* Simulated connecting lines */}
                    <div className="absolute top-[30%] left-[30%] h-0.5 w-[20%] bg-white/20 transform rotate-12"></div>
                    <div className="absolute top-[40%] left-[35%] h-0.5 w-[15%] bg-white/20 transform -rotate-12"></div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500/50"></span>
                    <span className="text-xs">Lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-teal-500/50"></span>
                    <span className="text-xs">Playbooks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-amber-500/50"></span>
                    <span className="text-xs">Tags</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-purple-500/50"></span>
                    <span className="text-xs">Bundles</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="glass-panel p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-left">{t('relatedLessons')}</h2>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                      <h4 className="text-sm font-medium">Water Conservation Insight {i}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        A brief description of this lesson and how it connects to other knowledge elements...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">
                          water
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">
                          conservation
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-4 text-left">Search by Tag</h2>
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm"
                    placeholder="Search tags..." 
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'water', 'conservation', 'policy', 'community', 'engagement', 
                    'education', 'monitoring', 'technology', 'resilience'
                  ].map(tag => (
                    <button key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Report Generator Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-2 flex justify-center">
        <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg flex items-center space-x-2">
          <Calendar size={16} />
          <span>{t('generateReport')}</span>
        </Button>
      </div>
    </AnimatedPage>
  );
};

export default Learn;
