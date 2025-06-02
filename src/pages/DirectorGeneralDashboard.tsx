import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useFullscreenPanel } from '@/hooks/use-fullscreen-panel';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Users, 
  Calendar, 
  Map, 
  Maximize2, 
  Minimize2,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  AlertTriangle
} from 'lucide-react';

const DirectorGeneralDashboard = () => {
  const { t, isRTL } = useTranslation();
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreenPanel();
  const [selectedView, setSelectedView] = useState('enhanced');

  // Mock data for dashboard
  const populationData = {
    total: '36.9M',
    growth: '+1.2%',
    trend: 'up',
    projectedTotal: '42.3M',
    projectedYear: 2030,
    ageDistribution: {
      under15: '24.8%',
      working: '68.3%',
      elderly: '6.9%'
    },
    genderRatio: {
      male: '57.2%',
      female: '42.8%'
    }
  };

  const economicData = {
    gdpGrowth: '+3.2%',
    unemployment: '5.7%',
    trend: 'down',
    laborForce: '18.4M',
    sectors: {
      services: '54.3%',
      industry: '38.6%',
      agriculture: '7.1%'
    }
  };

  const healthData = {
    lifeExpectancy: '76.4',
    trend: 'up',
    infantMortality: '12.3',
    healthcareAccess: '87.2%',
    vaccinations: '91.8%',
    chronicDiseases: {
      diabetes: '18.3%',
      hypertension: '21.7%',
      obesity: '35.4%'
    }
  };

  const educationData = {
    literacyRate: '97.8%',
    trend: 'up',
    enrollment: {
      primary: '99.3%',
      secondary: '94.7%',
      tertiary: '68.2%'
    },
    qualityIndex: '76.4/100',
    teacherRatio: '1:18'
  };

  const housingData = {
    homeOwnership: '64.7%',
    trend: 'down',
    averagePrice: '$320,000',
    affordabilityIndex: '5.8',
    constructionRate: '+2.3%',
    vacancyRate: '7.2%'
  };

  const alertsData = [
    {
      id: 1,
      title: 'Aging Population Alert',
      description: 'Elderly population projected to exceed 10% by 2025',
      severity: 'medium',
      date: '2023-06-15'
    },
    {
      id: 2,
      title: 'Housing Affordability Crisis',
      description: 'Housing price to income ratio reached critical level in 3 major cities',
      severity: 'high',
      date: '2023-06-10'
    },
    {
      id: 3,
      title: 'Rural Population Decline',
      description: 'Accelerated migration from rural areas detected in southern regions',
      severity: 'medium',
      date: '2023-06-05'
    }
  ];

  return (
    <div className={`min-h-screen relative ${isRTL ? 'rtl' : ''}`}>
      {/* Enhanced Zone Snapshots Grid */}
      <div className="pt-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
            {t('directorGeneralDashboard')}
          </h1>
          
          <Tabs defaultValue="enhanced" value={selectedView} onValueChange={setSelectedView} className="w-[400px]">
            <TabsList className="glass-panel">
              <TabsTrigger value="enhanced" className="data-[state=active]:bg-teal-500/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('enhancedView')}
              </TabsTrigger>
              <TabsTrigger value="compact" className="data-[state=active]:bg-teal-500/20">
                <LineChart className="w-4 h-4 mr-2" />
                {t('compactView')}
              </TabsTrigger>
              <TabsTrigger value="analytical" className="data-[state=active]:bg-teal-500/20">
                <PieChart className="w-4 h-4 mr-2" />
                {t('analyticalView')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Population Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('population')}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{populationData.total}</span>
                    <span className={`ml-2 text-sm font-medium ${populationData.trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                      {populationData.growth}
                      {populationData.trend === 'up' ? 
                        <ArrowUpRight className="h-4 w-4 ml-1" /> : 
                        <ArrowDownRight className="h-4 w-4 ml-1" />
                      }
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-teal-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('projectedPopulation')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{populationData.projectedTotal}</span>
                    <span className="ml-1 text-xs text-gray-400">({populationData.projectedYear})</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('workingAge')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{populationData.ageDistribution.working}</span>
                    <span className="ml-1 text-xs text-gray-400"><Percent className="h-3 w-3 inline" /></span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500" style={{ width: '68%' }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{t('under15')}: {populationData.ageDistribution.under15}</span>
                <span>{t('elderly')}: {populationData.ageDistribution.elderly}</span>
              </div>
            </div>
          </GlassCard>
          
          {/* Economic Indicators Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('economicIndicators')}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{economicData.gdpGrowth}</span>
                    <span className="ml-2 text-sm font-medium text-green-400 flex items-center">
                      GDP
                      <TrendingUp className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('unemployment')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{economicData.unemployment}</span>
                    <span className={`ml-1 text-xs ${economicData.trend === 'down' ? 'text-green-400' : 'text-red-400'}`}>
                      {economicData.trend === 'down' ? '▼' : '▲'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('laborForce')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{economicData.laborForce}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-1">
                <div className="h-2 bg-blue-500/80 rounded-l-full" style={{ width: `${economicData.sectors.services}` }}></div>
                <div className="h-2 bg-teal-500/80" style={{ width: `${economicData.sectors.industry}` }}></div>
                <div className="h-2 bg-green-500/80 rounded-r-full" style={{ width: `${economicData.sectors.agriculture}` }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{t('services')}</span>
                <span>{t('industry')}</span>
                <span>{t('agriculture')}</span>
              </div>
            </div>
          </GlassCard>
          
          {/* Health Metrics Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('healthMetrics')}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{healthData.lifeExpectancy}</span>
                    <span className="ml-2 text-sm font-medium text-green-400 flex items-center">
                      {t('years')}
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('infantMortality')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{healthData.infantMortality}</span>
                    <span className="ml-1 text-xs text-gray-400">{t('per1000')}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('healthcareAccess')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{healthData.healthcareAccess}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-teal-500" style={{ width: healthData.vaccinations }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{t('vaccinationRate')}: {healthData.vaccinations}</span>
              </div>
            </div>
          </GlassCard>
          
          {/* Education Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('education')}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{educationData.literacyRate}</span>
                    <span className="ml-2 text-sm font-medium text-green-400 flex items-center">
                      {t('literacy')}
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">{t('primary')}</div>
                  <div className="text-sm font-semibold text-white">{educationData.enrollment.primary}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">{t('secondary')}</div>
                  <div className="text-sm font-semibold text-white">{educationData.enrollment.secondary}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">{t('tertiary')}</div>
                  <div className="text-sm font-semibold text-white">{educationData.enrollment.tertiary}</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">{t('qualityIndex')}</div>
                <div className="text-sm font-semibold text-white">{educationData.qualityIndex}</div>
              </div>
              <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '76.4%' }}></div>
              </div>
            </div>
          </GlassCard>
          
          {/* Housing Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('housing')}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{housingData.homeOwnership}</span>
                    <span className={`ml-2 text-sm font-medium ${housingData.trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                      {housingData.trend === 'up' ? 
                        <ArrowUpRight className="h-4 w-4 ml-1" /> : 
                        <ArrowDownRight className="h-4 w-4 ml-1" />
                      }
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Map className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('averagePrice')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{housingData.averagePrice}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{t('affordabilityIndex')}</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-white">{housingData.affordabilityIndex}</span>
                    <span className="ml-1 text-xs text-red-400">▲</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-gray-400">{t('constructionRate')}</div>
                <div className="text-sm font-semibold text-white">{housingData.constructionRate}</div>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <div className="text-xs text-gray-400">{t('vacancyRate')}</div>
                <div className="text-sm font-semibold text-white">{housingData.vacancyRate}</div>
              </div>
            </div>
          </GlassCard>
          
          {/* Alerts Card */}
          <GlassCard className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{t('alerts')}</h3>
                  <div className="text-sm text-gray-400 mt-1">{t('recentAlerts')}</div>
                </div>
                <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                {alertsData.map(alert => (
                  <div key={alert.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className={`h-2 w-2 mt-1.5 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-500' : 
                        alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-white">{alert.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{alert.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Calendar and Events Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t('upcomingEvents')}</h2>
          <Button variant="outline" size="sm" className="text-teal-400 border-teal-400/30 hover:bg-teal-400/10">
            <Calendar className="h-4 w-4 mr-2" />
            {t('viewCalendar')}
          </Button>
        </div>
        
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event 1 */}
            <div className="bg-white/5 rounded-lg p-4 border border-teal-500/20 hover:border-teal-500/40 transition-colors">
              <div className="flex justify-between items-start">
                <div className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs font-medium">
                  {t('conference')}
                </div>
                <div className="text-xs text-gray-400">June 15-18, 2023</div>
              </div>
              <h3 className="mt-3 text-base font-medium text-white">International Population Summit</h3>
              <p className="mt-1 text-sm text-gray-400">Annual gathering of population experts to discuss global trends and policies.</p>
              <div className="mt-4 flex items-center text-xs text-teal-400">
                <Map className="h-3 w-3 mr-1" />
                <span>Geneva, Switzerland</span>
              </div>
            </div>
            
            {/* Event 2 */}
            <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <div className="flex justify-between items-start">
                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                  {t('workshop')}
                </div>
                <div className="text-xs text-gray-400">June 22, 2023</div>
              </div>
              <h3 className="mt-3 text-base font-medium text-white">Urban Planning Workshop</h3>
              <p className="mt-1 text-sm text-gray-400">Collaborative session on integrating population data into urban development plans.</p>
              <div className="mt-4 flex items-center text-xs text-blue-400">
                <Map className="h-3 w-3 mr-1" />
                <span>Virtual Event</span>
              </div>
            </div>
            
            {/* Event 3 */}
            <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="flex justify-between items-start">
                <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                  {t('report')}
                </div>
                <div className="text-xs text-gray-400">June 30, 2023</div>
              </div>
              <h3 className="mt-3 text-base font-medium text-white">Q2 Population Report Release</h3>
              <p className="mt-1 text-sm text-gray-400">Quarterly report on population metrics, trends, and projections.</p>
              <div className="mt-4 flex items-center text-xs text-purple-400">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Publication Date</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Strategic Initiatives Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t('strategicInitiatives')}</h2>
          <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10">
            {t('viewAll')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initiative 1 */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white">Rural Development Program</h3>
            <div className="mt-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-green-400">{t('onTrack')}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-sm text-gray-400">Q2 2023 - Q4 2024</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Comprehensive initiative to revitalize rural communities and slow urban migration through infrastructure development and economic incentives.
            </p>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">{t('progress')}</div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-teal-500" style={{ width: '35%' }}></div>
              </div>
              <div className="mt-1 text-right text-xs text-gray-400">35%</div>
            </div>
          </GlassCard>
          
          {/* Initiative 2 */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white">Urban Housing Affordability</h3>
            <div className="mt-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm text-amber-400">{t('needsAttention')}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-sm text-gray-400">Q1 2023 - Q3 2023</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Policy framework to address rising housing costs in major urban centers through zoning reforms, subsidies, and public-private partnerships.
            </p>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">{t('progress')}</div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: '62%' }}></div>
              </div>
              <div className="mt-1 text-right text-xs text-gray-400">62%</div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DirectorGeneralDashboard;
