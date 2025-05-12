
import React, { useEffect, useState } from 'react';
import { Clock, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  zone: string;
}

const ActivityStrip: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          user: 'Alex Morgan',
          action: 'updated',
          target: 'Health Access Strategy',
          time: '5 minutes ago',
          zone: 'ACT'
        },
        {
          id: '2',
          user: 'Jamie Wilson',
          action: 'created',
          target: 'Education System Map',
          time: '24 minutes ago',
          zone: 'THINK'
        },
        {
          id: '3',
          user: 'Taylor Reed',
          action: 'commented on',
          target: 'Economic Trends Report',
          time: '1 hour ago',
          zone: 'MONITOR'
        },
        {
          id: '4',
          user: 'Casey Kim',
          action: 'generated',
          target: 'Housing Intervention Blueprint',
          time: '3 hours ago',
          zone: 'INNOVATE'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'THINK':
        return 'text-blue-400 bg-blue-400/10';
      case 'ACT':
        return 'text-teal-400 bg-teal-400/10';
      case 'MONITOR':
        return 'text-amber-400 bg-amber-400/10';
      case 'INNOVATE':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-700/30 rounded mb-6"></div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-24 rounded-lg bg-gray-700/30"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-left">
        <Clock size={18} className="mr-2" />
        Recent Activity
      </h2>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-64 rounded-lg border border-white/10 p-4 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <User size={14} />
                </div>
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {activity.user}
                </span>
              </div>
              
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${getZoneColor(activity.zone)}`}>
                {activity.zone}
              </span>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">
              <span className="text-gray-400">{activity.action}</span>
              {' '}
              <span className="font-medium">{activity.target}</span>
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{activity.time}</span>
              <button className="p-1 rounded-full hover:bg-white/10">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 flex justify-center">
        <div className="flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-6 h-1 rounded-full ${i === 0 ? 'bg-white/30' : 'bg-white/10'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityStrip;
