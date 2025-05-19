
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

export const SystemEventsTimeline: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [scrubPosition, setScrubPosition] = useState(50);
  
  // Mock timeline events
  const events = [
    { id: 1, type: 'sim', position: 10, date: '2025-04-01', title: 'Water Policy Sim Run' },
    { id: 2, type: 'bundle', position: 25, date: '2025-04-15', title: 'Resource Efficiency Bundle Launch' },
    { id: 3, type: 'lesson', position: 40, date: '2025-05-01', title: 'Mid-Period Review' },
    { id: 4, type: 'sim', position: 60, date: '2025-05-10', title: 'Social Trust Sim Run' },
    { id: 5, type: 'bundle', position: 80, date: '2025-05-15', title: 'Social Cohesion Bundle Launch' },
    { id: 6, type: 'lesson', position: 95, date: '2025-05-18', title: 'Lesson Captured' },
  ];
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sim': return 'bg-blue-400';
      case 'bundle': return 'bg-teal-400';
      case 'lesson': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };
  
  const handleEventClick = (id: number) => {
    if (selectedEvent === id) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(id);
    }
  };
  
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setScrubPosition(Math.max(0, Math.min(100, position)));
  };
  
  return (
    <div className="relative pt-8 pb-4">
      {/* Selected event tooltip */}
      {selectedEvent !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-lg p-3 shadow-lg z-10 border border-white/20 min-w-60"
        >
          <div className="text-sm">
            <div className="font-medium">{events.find(e => e.id === selectedEvent)?.title}</div>
            <div className="text-xs text-gray-400">{events.find(e => e.id === selectedEvent)?.date}</div>
          </div>
        </motion.div>
      )}
      
      {/* Timeline track */}
      <div 
        className="relative h-2 bg-white/10 rounded-full cursor-pointer" 
        onClick={handleScrub}
      >
        {/* Events markers */}
        {events.map((event) => (
          <div 
            key={event.id}
            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${getTypeColor(event.type)} cursor-pointer z-10 transition-transform hover:scale-125`}
            style={{ left: `${event.position}%` }}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(event.id);
            }}
          />
        ))}
        
        {/* Scrub handle */}
        <motion.div 
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing z-20"
          style={{ left: `${scrubPosition}%`, marginLeft: -12 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            const parentWidth = (e.target as HTMLElement).parentElement?.clientWidth || 0;
            const newPosition = scrubPosition + (info.delta.x / parentWidth) * 100;
            setScrubPosition(Math.max(0, Math.min(100, newPosition)));
          }}
        />
        
        {/* Elapsed track */}
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
          style={{ width: `${scrubPosition}%` }}
        />
      </div>
      
      {/* Month labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-400">
        <div>Apr 2025</div>
        <div>May 2025</div>
        <div>Jun 2025</div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-6 text-xs text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
          <span>{t('simulation')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-teal-400 mr-1"></div>
          <span>{t('bundle')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
          <span>{t('lesson')}</span>
        </div>
      </div>
    </div>
  );
};
