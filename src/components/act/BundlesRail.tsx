
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, MoreVertical, Archive, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBundles, useBundleActions } from '@/hooks/useBundles';
import { useToast } from '@/hooks/use-toast';
import BundleModal from './BundleModal';
import type { Bundle, BundleFormData } from './types/act-types';

interface BundlesRailProps {
  selectedBundle?: Bundle | null;
  onBundleSelect: (bundle: Bundle | null) => void;
}

const BundlesRail: React.FC<BundlesRailProps> = ({
  selectedBundle,
  onBundleSelect,
}) => {
  const { t, isRTL } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'pilot' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  // Use real data from our hooks
  const { data: rawBundles, isLoading, error } = useBundles(statusFilter === 'all' ? undefined : statusFilter);
  const { createBundle, updateBundle, approveBundle } = useBundleActions();

  // Convert database bundles to UI bundles
  const bundles = rawBundles?.map(bundle => ({
    ...bundle,
    owner: bundle.createdBy,
    lastModified: bundle.updatedAt.toISOString()
  })) || [];

  const filteredBundles = bundles.filter(bundle =>
    bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bundle.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bundle.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pilot': return <AlertTriangle className="h-4 w-4" />;
      case 'completed': return <Archive className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'active': return 'bg-teal-500/20 text-teal-400';
      case 'pilot': return 'bg-orange-500/20 text-orange-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleCreateBundle = () => {
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  const handleSaveBundle = (bundleData: BundleFormData) => {
    // Make this function synchronous and handle async operations inside
    if (editingBundle) {
      updateBundle.mutateAsync({
        bundleId: editingBundle.id,
        updates: {
          name: bundleData.name,
          summary: bundleData.summary,
          status: bundleData.status || editingBundle.status,
          leveragePoints: bundleData.tags?.map(tag => ({ name: tag.name, type: tag.type })) || [],
          tags: bundleData.tags?.map(tag => tag.name) || [],
          objectives: bundleData.objectives || [],
          pillars: bundleData.pillars || [],
          geography: bundleData.geography || []
        }
      }).catch(error => {
        console.error('Error updating bundle:', error);
      });
    } else {
      createBundle.mutateAsync({
        name: bundleData.name,
        summary: bundleData.summary,
        status: bundleData.status || 'draft',
        leveragePoints: bundleData.tags?.map(tag => ({ name: tag.name, type: tag.type })) || [],
        tags: bundleData.tags?.map(tag => tag.name) || [],
        objectives: bundleData.objectives || [],
        pillars: bundleData.pillars || [],
        geography: bundleData.geography || []
      }).then(newRawBundle => {
        // Convert to UI bundle and select it
        const newBundle = {
          ...newRawBundle,
          owner: newRawBundle.createdBy,
          lastModified: newRawBundle.updatedAt.toISOString()
        };
        onBundleSelect(newBundle);
      }).catch(error => {
        console.error('Error creating bundle:', error);
      });
    }
    setIsModalOpen(false);
  };

  const handleApproveBundle = (bundleId: string) => {
    approveBundle.mutateAsync(bundleId).catch(error => {
      console.error('Error approving bundle:', error);
    });
  };

  if (error) {
    return (
      <div className="w-80 glass-morphism border-r border-white/10 p-6">
        <div className="text-center text-red-400">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>Error loading bundles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-80 glass-morphism border-r border-white/10 flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t('bundles')}</h2>
            <Button
              onClick={handleCreateBundle}
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('create')}
            </Button>
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
          <div className="flex flex-wrap gap-2">
            {['all', 'draft', 'active', 'pilot', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status as any)}
                className="text-xs"
              >
                {t(status)}
              </Button>
            ))}
          </div>
        </div>

        {/* Bundles List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
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
                    className={`p-4 rounded-lg glass-panel border cursor-pointer transition-all duration-200 ${
                      selectedBundle?.id === bundle.id
                        ? 'border-teal-500/50 bg-teal-500/10'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                    }`}
                    onClick={() => onBundleSelect(bundle)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm line-clamp-2">
                        {bundle.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBundle(bundle);
                        }}
                        className="h-6 w-6 p-0 hover:bg-white/10"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {bundle.summary || t('noSummary')}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getStatusColor(bundle.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(bundle.status)}
                            <span className="text-xs capitalize">{t(bundle.status)}</span>
                          </div>
                        </Badge>
                        {bundle.coherence && (
                          <span className="text-xs text-gray-400">
                            {bundle.coherence}% coherent
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
                          className="text-teal-400 hover:text-teal-300 text-xs px-2 py-1 h-auto"
                        >
                          Approve ▶
                        </Button>
                      )}
                    </div>

                    {bundle.tags && bundle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {bundle.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-1 py-0 border-gray-600 text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {bundle.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 border-gray-600 text-gray-300">
                            +{bundle.tags.length - 3}
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
