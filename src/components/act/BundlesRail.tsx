import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, MoreVertical, Archive, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealBundles, useRealBundleActions } from './hooks/useRealBundles';
import { useTestUser } from '@/hooks/useTestUser';
import { useToast } from '@/hooks/use-toast';
import { useDemoIntegration } from '@/hooks/use-demo-integration';
import BundleModal from './BundleModal';
import type { Bundle, BundleFormData } from './types/act-types';

interface BundlesRailProps {
  selectedBundle?: Bundle | null;
  onBundleSelect: (bundle: Bundle | null) => void;
}

const BundlesRail: React.FC<BundlesRailProps> = ({
  selectedBundle,
  onBundleSelect
}) => {
  const { t, isRTL } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'pilot' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  // Initialize test user for development
  useTestUser();
  
  // Demo integration
  const demoIntegration = useDemoIntegration();

  // Use real data from Supabase or demo data
  const { data: bundles = [], isLoading, error } = useRealBundles(statusFilter === 'all' ? undefined : statusFilter);
  const { createBundle, updateBundle, approveBundle } = useRealBundleActions();

  // Convert database bundles to UI bundles
  const filteredBundles = bundles.filter(bundle => 
    bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bundle.summary?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bundle.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-3 w-3" />;
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'pilot':
        return <AlertTriangle className="h-3 w-3" />;
      case 'completed':
        return <Archive className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/20 text-gray-400';
      case 'active':
        return 'bg-teal-500/20 text-teal-400';
      case 'pilot':
        return 'bg-orange-500/20 text-orange-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleCreateBundle = () => {
    console.log('Create bundle clicked');
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    console.log('Edit bundle clicked:', bundle.id);
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  const handleBundleClick = (bundle: Bundle) => {
    console.log('Bundle selected:', bundle.id, bundle.name);
    onBundleSelect(bundle);
  };

  const handleSaveBundle = (bundleData: BundleFormData) => {
    console.log('Saving bundle:', bundleData);
    
    if (editingBundle) {
      updateBundle.mutateAsync({
        bundleId: editingBundle.id,
        updates: bundleData
      }).then((data) => {
        // Transform the returned database object to Bundle format
        const transformedBundle: Bundle = {
          id: data.id,
          name: data.name,
          summary: data.summary,
          createdBy: data.created_by,
          leveragePoints: Array.isArray(data.leverage_points) ? 
            data.leverage_points.filter((point): point is string => typeof point === 'string') : [],
          objectives: data.objectives || [],
          pillars: data.pillars || [],
          geography: data.geography || [],
          tags: data.tags || [],
          status: data.status as 'draft' | 'active' | 'pilot' | 'completed',
          coherence: data.coherence || 0,
          ndiImpact: data.ndi_impact || 0,
          isApproved: data.is_approved || false,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        onBundleSelect(transformedBundle);
        
        toast({
          title: "Bundle Updated",
          description: "Bundle has been successfully updated."
        });
      }).catch((error) => {
        console.error('Error updating bundle:', error);
        toast({
          title: "Error",
          description: "Failed to update bundle.",
          variant: "destructive"
        });
      });
    } else {
      createBundle.mutateAsync(bundleData).then((data) => {
        // Transform the returned database object to Bundle format
        const transformedBundle: Bundle = {
          id: data.id,
          name: data.name,
          summary: data.summary,
          createdBy: data.created_by,
          leveragePoints: Array.isArray(data.leverage_points) ? 
            data.leverage_points.filter((point): point is string => typeof point === 'string') : [],
          objectives: data.objectives || [],
          pillars: data.pillars || [],
          geography: data.geography || [],
          tags: data.tags || [],
          status: data.status as 'draft' | 'active' | 'pilot' | 'completed',
          coherence: data.coherence || 0,
          ndiImpact: data.ndi_impact || 0,
          isApproved: data.is_approved || false,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        onBundleSelect(transformedBundle);
        
        toast({
          title: "Bundle Created",
          description: "Bundle has been successfully created."
        });
      }).catch((error) => {
        console.error('Error creating bundle:', error);
        toast({
          title: "Error",
          description: "Failed to create bundle.",
          variant: "destructive"
        });
      });
    }
    
    setIsModalOpen(false);
  };

  const handleApproveBundle = (bundleId: string) => {
    console.log('Approve bundle clicked:', bundleId);
    
    approveBundle.mutateAsync(bundleId).then(() => {
      toast({
        title: "Bundle Approved",
        description: "Bundle has been approved and activated."
      });
    }).catch((error) => {
      console.error('Error approving bundle:', error);
      toast({
        title: "Error",
        description: "Failed to approve bundle.",
        variant: "destructive"
      });
    });
  };

  if (error) {
    return (
      <div className="w-80 glass-morphism border-r border-white/10 p-6">
        <div className="text-center text-amber-400">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>{demoIntegration.isDemoMode ? 'Demo Mode Active' : 'Using offline mode'}</p>
          <p className="text-xs text-gray-400">
            {demoIntegration.isDemoMode ? 'Using demo data' : 'Database connection unavailable'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t('bundles')}</h2>
            {demoIntegration.isDemoMode && (
              <Badge variant="outline" className="text-xs bg-teal-500/20 text-teal-400 border-teal-500/30">
                Demo
              </Badge>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={t('searchBundles')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-1">
            {['all', 'draft', 'active', 'pilot', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status as any)}
                className="text-xs px-2 py-1 h-auto"
              >
                {t(status)}
              </Button>
            ))}
          </div>
        </div>

        {/* Bundles List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredBundles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Archive className="h-8 w-8 mx-auto mb-2" />
                  <p>{searchTerm ? t('noBundlesFound') : t('noBundlesYet')}</p>
                  {!error && !demoIntegration.isDemoMode && (
                    <p className="text-xs mt-1">Create your first bundle to get started</p>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  {filteredBundles.map((bundle) => (
                    <motion.div
                      key={bundle.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-3 rounded-lg glass-panel border cursor-pointer transition-all duration-200 ${
                        selectedBundle?.id === bundle.id
                          ? 'border-teal-500/50 bg-teal-500/10'
                          : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                      }`}
                      onClick={() => handleBundleClick(bundle)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm flex-1 pr-2 break-words">
                          {bundle.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBundle(bundle);
                          }}
                          className="h-6 w-6 p-0 hover:bg-white/10 flex-shrink-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-400 mb-3 break-words">
                        {bundle.summary || t('noSummary')}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(bundle.status)} text-xs px-2 py-0`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(bundle.status)}
                              <span className="capitalize">{t(bundle.status)}</span>
                            </div>
                          </Badge>
                          {bundle.coherence > 0 && (
                            <span className="text-xs text-gray-400">
                              {bundle.coherence}%
                            </span>
                          )}
                        </div>
                        {bundle.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveBundle(bundle.id);
                            }}
                            className="text-teal-400 hover:text-teal-300 text-xs px-2 py-1 h-auto flex-shrink-0"
                          >
                            Approve
                          </Button>
                        )}
                      </div>

                      {bundle.tags && bundle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {bundle.tags.slice(0, 2).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs px-1 py-0 border-gray-600 text-gray-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {bundle.tags.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-1 py-0 border-gray-600 text-gray-300"
                            >
                              +{bundle.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Bundle Modal */}
      <BundleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialBundle={editingBundle}
        onSave={handleSaveBundle}
      />
    </>
  );
};

export default BundlesRail;
