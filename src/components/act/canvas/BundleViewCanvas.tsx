import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealBundle } from '../hooks/useRealBundles';
import { Target, MapPin, Tag, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface BundleViewCanvasProps {
  bundleId: string;
}

const BundleViewCanvas: React.FC<BundleViewCanvasProps> = ({ bundleId }) => {
  const { data: bundle, isLoading, error } = useRealBundle(bundleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load bundle data</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Bundle Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{bundle.name}</h1>
              <p className="text-gray-300 leading-relaxed">
                {bundle.summary || 'No summary available for this bundle.'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant={bundle.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {bundle.status}
              </Badge>
              {bundle.isApproved && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Created:</span>
              <p className="text-white font-medium">
                {new Date(bundle.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Updated:</span>
              <p className="text-white font-medium">
                {new Date(bundle.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Coherence:</span>
              <p className="text-white font-medium">{bundle.coherence}%</p>
            </div>
            <div>
              <span className="text-gray-400">NDI Impact:</span>
              <p className="text-white font-medium">{bundle.ndiImpact}</p>
            </div>
          </div>
        </motion.div>

        {/* Objectives Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-white">Objectives</h2>
          </div>
          {bundle.objectives && bundle.objectives.length > 0 ? (
            <div className="space-y-3">
              {bundle.objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 flex-1">{objective}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No objectives defined</p>
          )}
        </motion.div>

        {/* Geography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Geographic Coverage</h2>
          </div>
          {bundle.geography && bundle.geography.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bundle.geography.map((location, index) => (
                <Badge key={index} variant="outline" className="bg-blue-500/10 border-blue-500/30">
                  {location}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No geographic areas specified</p>
          )}
        </motion.div>

        {/* Pillars Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded"></div>
            </div>
            <h2 className="text-lg font-semibold text-white">Strategic Pillars</h2>
          </div>
          {bundle.pillars && bundle.pillars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bundle.pillars.map((pillar, index) => (
                <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-center">
                  <span className="text-purple-300 font-medium capitalize">{pillar}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No pillars assigned</p>
          )}
        </motion.div>

        {/* Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Tags</h2>
          </div>
          {bundle.tags && bundle.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bundle.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-amber-500/10 border-amber-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No tags assigned</p>
          )}
        </motion.div>

        {/* Leverage Points Section */}
        {bundle.leveragePoints && bundle.leveragePoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Leverage Points</h2>
            <div className="space-y-3">
              {bundle.leveragePoints.map((point, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-gray-300">
                    {typeof point === 'object' ? point.name || `Leverage Point ${index + 1}` : point}
                  </span>
                  {typeof point === 'object' && point.type && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {point.type}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
};

export default BundleViewCanvas;
