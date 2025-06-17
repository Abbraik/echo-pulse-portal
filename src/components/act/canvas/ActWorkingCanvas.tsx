
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Target, MapPin, Settings, Users, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealBundle } from '../hooks/useRealBundles';
import { Bundle } from '../types/act-types';

interface ActWorkingCanvasProps {
  bundleId: string | null;
  onClose: () => void;
}

const ActWorkingCanvas: React.FC<ActWorkingCanvasProps> = ({ bundleId, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: bundle, isLoading, error } = useRealBundle(bundleId || '');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'objectives', label: 'Objectives', icon: Target },
    { id: 'geography', label: 'Geography', icon: MapPin },
    { id: 'leverage', label: 'Leverage Points', icon: Settings },
    { id: 'stakeholders', label: 'Stakeholders', icon: Users },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  ];

  if (!bundleId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full z-50 glass-panel-cinematic rounded-2xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="absolute inset-0 w-full h-full z-50 glass-panel-cinematic rounded-2xl flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading bundle data</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-300 mb-2">Bundle Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge variant="outline" className="capitalize">
                        {bundle.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{new Date(bundle.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">{new Date(bundle.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approved:</span>
                      <Badge variant={bundle.isApproved ? "default" : "secondary"}>
                        {bundle.isApproved ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-teal-300 mb-2">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coherence:</span>
                      <span className="text-white">{bundle.coherence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">NDI Impact:</span>
                      <span className="text-white">{bundle.ndiImpact}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-300 mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {bundle.summary || 'No summary available for this bundle.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-teal-300 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {bundle.tags && bundle.tags.length > 0 ? (
                      bundle.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-300">Bundle Objectives</h3>
            {bundle.objectives && bundle.objectives.length > 0 ? (
              <div className="space-y-3">
                {bundle.objectives.map((objective, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 flex-1">{objective}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No objectives defined for this bundle</p>
              </div>
            )}
          </div>
        );

      case 'geography':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-300">Geographic Coverage</h3>
            {bundle.geography && bundle.geography.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {bundle.geography.map((location, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                    <MapPin className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                    <span className="text-gray-300 text-sm">{location}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No geographic areas specified</p>
              </div>
            )}
          </div>
        );

      case 'leverage':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-300">Leverage Points</h3>
            {bundle.leveragePoints && bundle.leveragePoints.length > 0 ? (
              <div className="space-y-3">
                {bundle.leveragePoints.map((point, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="h-4 w-4 text-teal-400" />
                      <span className="text-white font-medium">
                        {typeof point === 'object' ? point.name || `Leverage Point ${index + 1}` : point}
                      </span>
                    </div>
                    {typeof point === 'object' && point.type && (
                      <Badge variant="outline" className="text-xs">
                        {point.type}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leverage points identified</p>
              </div>
            )}
          </div>
        );

      case 'stakeholders':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-300">Stakeholder Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-blue-300">Primary Stakeholders</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">Government Entities</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">Private Sector</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium text-purple-300">Secondary Stakeholders</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Civil Society</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">International Organizations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-300">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Coherence Score</span>
                  <BarChart3 className="h-4 w-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{bundle.coherence}%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${bundle.coherence}%` }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">NDI Impact</span>
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{bundle.ndiImpact}</div>
                <div className="text-sm text-gray-400">Impact Score</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-md font-medium text-blue-300">Pillar Coverage</h4>
              {bundle.pillars && bundle.pillars.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {bundle.pillars.map((pillar, index) => (
                    <div key={index} className="p-2 bg-white/5 rounded border border-white/10 text-center">
                      <span className="text-xs text-gray-300 capitalize">{pillar}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No pillars assigned</p>
              )}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-400">Tab content not available</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 w-full h-full z-50"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="w-full h-full glass-panel-cinematic rounded-2xl flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{bundle.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Bundle Analysis & Configuration</span>
                  <Badge variant="outline" className="capitalize">
                    {bundle.status}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActWorkingCanvas;
