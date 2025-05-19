
import React, { useState } from 'react';
import { Check, Pencil, Plus, Search, Filter, ArrowRight, Tag, Clock, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { BundleTag } from './types/act-types';

interface Bundle {
  id: string;
  name: string;
  summary?: string;
  coherence: number;
  ndiImpact: number;
  isApproved: boolean;
  status: 'draft' | 'pending' | 'active';
  owner: string;
  lastModified: string;
  tags: BundleTag[];
}

interface BundlesRailProps {
  selectedBundle: string | null;
  onSelectBundle: (bundleId: string) => void;
}

const BundlesRail: React.FC<BundlesRailProps> = ({ 
  selectedBundle, 
  onSelectBundle 
}) => {
  const { t, isRTL } = useTranslation();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [rapidTestMode, setRapidTestMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Sample data for bundles
  const bundles: Bundle[] = [
    { 
      id: 'b1', 
      name: "Water Efficiency Boost", 
      summary: "Optimize water tariffs and incentives to improve efficiency",
      coherence: 58, 
      ndiImpact: 3.2,
      isApproved: false,
      status: 'draft',
      owner: "Water Management Team",
      lastModified: "2h ago",
      tags: ["Water", "Incentive", "Short-Term"] as BundleTag[]
    },
    { 
      id: 'b2', 
      name: "Education Reform", 
      summary: "Restructure curriculum to enhance future skills development",
      coherence: 87, 
      ndiImpact: 5.1,
      isApproved: true,
      status: 'active',
      owner: "Education Directorate",
      lastModified: "1d ago",
      tags: ["Education", "Social", "Long-Term"] as BundleTag[]
    },
    { 
      id: 'b3', 
      name: "Health Infrastructure", 
      summary: "Expand preventative care facilities in underserved areas",
      coherence: 72, 
      ndiImpact: 2.8,
      isApproved: false,
      status: 'pending',
      owner: "Health Authority",
      lastModified: "4h ago",
      tags: ["Health", "Social", "Infrastructure"] as BundleTag[]
    },
    { 
      id: 'b4', 
      name: "Digital Transformation",
      summary: "Accelerate e-government services adoption across agencies", 
      coherence: 65, 
      ndiImpact: 1.9,
      isApproved: false,
      status: 'draft',
      owner: "Digital Agency",
      lastModified: "3d ago",
      tags: ["Digital", "Governance", "Innovation"] as BundleTag[]
    },
  ];
  
  // Filter bundles based on search query and status filter
  const filteredBundles = bundles.filter((bundle) => {
    const matchesSearch = searchQuery 
      ? bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bundle.summary && bundle.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bundle.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesStatus = statusFilter 
      ? bundle.status === statusFilter 
      : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 80) return 'bg-green-500';
    if (coherence >= 60) return 'bg-amber-400';
    return 'bg-rose-500';
  };
  
  const getNdiImpactClass = (impact: number) => {
    if (impact > 4) return 'text-green-500';
    if (impact > 2) return 'text-teal-400';
    return 'text-blue-400';
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active');
      case 'pending': return t('pendingApproval');
      default: return t('draft');
    }
  };
  
  const getBundleCardClass = (bundle: Bundle) => {
    let baseClass = 'relative p-4 rounded-lg transition-all duration-300 hover:shadow-lg mb-3';
    
    // Apply different styling based on selection status
    if (selectedBundle === bundle.id) {
      baseClass += ' ring-2 ring-teal-500 shadow-md';
    } else {
      baseClass += ' border border-white/10';
    }
    
    // Apply heat map coloring if enabled
    if (showHeatmap) {
      const opacity = bundle.coherence / 100 * 0.5 + 0.1; // Scale from 0.1 to 0.6
      
      if (bundle.coherence >= 80) {
        baseClass += ' bg-green-500/20 backdrop-blur-sm';
      } else if (bundle.coherence >= 60) {
        baseClass += ' bg-amber-500/20 backdrop-blur-sm';
      } else {
        baseClass += ' bg-rose-500/20 backdrop-blur-sm';
      }
    } else {
      baseClass += ' bg-white/5 backdrop-blur-sm';
    }
    
    return baseClass;
  };
  
  return (
    <GlassCard className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-medium">{t('policyBundles', { defaultValue: 'Policy Bundles' })}</h2>
        
        {/* Quick action buttons */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 bg-white/5 border-white/20 hover:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="text-xs">{t('newBundle')}</span>
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={isRTL ? "البحث عن حزمة..." : "Find bundle..."}
            className="pl-9 bg-white/5 border-white/20 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button 
            onClick={() => setStatusFilter(statusFilter === null ? null : null)} 
            className={`px-3 py-1 rounded-full text-xs ${
              statusFilter === null 
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
              : 'bg-white/5 hover:bg-white/10 border border-white/20'
            }`}
          >
            {isRTL ? "الكل" : "All"}
          </button>
          <button 
            onClick={() => setStatusFilter(statusFilter === 'draft' ? null : 'draft')} 
            className={`px-3 py-1 rounded-full text-xs ${
              statusFilter === 'draft' 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-white/5 hover:bg-white/10 border border-white/20'
            }`}
          >
            {t('draft')}
          </button>
          <button 
            onClick={() => setStatusFilter(statusFilter === 'pending' ? null : 'pending')} 
            className={`px-3 py-1 rounded-full text-xs ${
              statusFilter === 'pending' 
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
              : 'bg-white/5 hover:bg-white/10 border border-white/20'
            }`}
          >
            {t('pendingApproval')}
          </button>
          <button 
            onClick={() => setStatusFilter(statusFilter === 'active' ? null : 'active')} 
            className={`px-3 py-1 rounded-full text-xs ${
              statusFilter === 'active' 
              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
              : 'bg-white/5 hover:bg-white/10 border border-white/20'
            }`}
          >
            {t('active')}
          </button>
        </div>
      </div>
      
      {/* Bundle cards container */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredBundles.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {isRTL ? "لا توجد حزم مطابقة" : "No matching bundles found"}
          </div>
        ) : filteredBundles.map(bundle => (
          <motion.div 
            key={bundle.id}
            className={getBundleCardClass(bundle)}
            onClick={() => onSelectBundle(bundle.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layoutId={`bundle-card-${bundle.id}`}
          >
            {/* Status ribbon - positioned in top-right */}
            <div className={`absolute top-0 right-0 ${isRTL ? 'left-0 right-auto' : ''} px-2 py-1 text-xs ${getStatusBadgeClass(bundle.status)} rounded-bl-lg`}>
              {getStatusText(bundle.status)}
            </div>
            
            {/* Bundle name and coherence */}
            <div className="flex justify-between items-start mt-4">
              <h3 className="font-medium text-base">{bundle.name}</h3>
              
              {/* Coherence badge */}
              <div className={`relative w-8 h-8 rounded-full flex items-center justify-center ${getCoherenceColor(bundle.coherence)}`}>
                <div className="absolute inset-0.5 bg-gray-900/80 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{bundle.coherence}</span>
                </div>
              </div>
            </div>
            
            {/* Summary */}
            {bundle.summary && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{bundle.summary}</p>
            )}
            
            {/* NDI impact */}
            <div className="mt-3 flex items-center">
              <span className="text-xs text-gray-400">{t('projectedNdi')}:</span>
              <span className={`ml-1 text-sm font-medium ${getNdiImpactClass(bundle.ndiImpact)}`}>
                +{bundle.ndiImpact} {t('ndiPoints')}
              </span>
              {/* Mini delta chart - simplified arrow representation */}
              <ArrowRight className={`h-3 w-3 ml-1 ${getNdiImpactClass(bundle.ndiImpact)}`} />
            </div>
            
            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1">
              {bundle.tags.map((tag, idx) => (
                <span 
                  key={`${bundle.id}-tag-${idx}`} 
                  className="inline-block rounded-full bg-white/5 border border-white/10 text-xs px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Metadata & actions row */}
            <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center text-xs text-gray-400">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[100px]">{bundle.owner}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{bundle.lastModified}</span>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-white/10 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit action
                  }}
                >
                  <Pencil className="h-3 w-3 text-gray-400" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-white/10 flex items-center justify-center ${bundle.isApproved ? 'text-green-500' : 'text-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle approve action
                  }}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* New Bundle button */}
        <motion.div 
          className="p-4 rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5 mr-2 text-teal-400" />
          <span>{t('newBundle', { defaultValue: 'New Bundle' })}</span>
        </motion.div>
      </div>
      
      {/* Toggle controls */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm">{t('showCoherenceHeatmap', { defaultValue: 'Show Coherence Heatmap' })}</span>
          </div>
          <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm">{t('rapidTestMode', { defaultValue: 'Switch to Rapid-Test Mode' })}</span>
            {rapidTestMode && (
              <span className="ml-2 px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                {isRTL ? "مفعّل" : "Active"}
              </span>
            )}
          </div>
          <Switch checked={rapidTestMode} onCheckedChange={setRapidTestMode} />
        </div>
      </div>
    </GlassCard>
  );
};

export default BundlesRail;
