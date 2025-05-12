
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

interface ActivityEvent {
  id: string;
  event: string;
  time: string;
  timeAgo: string;
}

const ActivityTimeline: React.FC = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setEvents([
        {
          id: '1',
          event: 'Equilibrium bands computed',
          time: '10:45 AM',
          timeAgo: '5m ago'
        },
        {
          id: '2',
          event: 'Population model updated',
          time: '10:30 AM',
          timeAgo: '20m ago'
        },
        {
          id: '3',
          event: 'Pilot program launched',
          time: '9:15 AM',
          timeAgo: '1h ago'
        },
        {
          id: '4',
          event: 'Resource allocation optimized',
          time: '8:45 AM',
          timeAgo: '2h ago'
        },
        {
          id: '5',
          event: 'Forecast models recalibrated',
          time: '8:00 AM',
          timeAgo: '3h ago'
        },
        {
          id: '6',
          event: 'New data sources integrated',
          time: 'Yesterday',
          timeAgo: '1d ago'
        },
        {
          id: '7',
          event: 'System maintenance completed',
          time: 'Yesterday',
          timeAgo: '1d ago'
        },
      ]);
    }, 800);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (events.length > 0 && !isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [events.length, isPaused]);
  
  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };
  
  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };
  
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaused(true);
    const newIndex = parseInt(e.target.value);
    setCurrentIndex(newIndex);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (events.length === 0) {
    return (
      <div className="glass-panel p-4 animate-pulse flex items-center justify-center h-32">
        <Clock className="mr-2 text-gray-400" size={18} />
        <span className="text-gray-400">Loading activity...</span>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="glass-panel p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Activity size={18} className="text-teal-400" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            onClick={togglePause}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" fill="currentColor" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm6 0h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="w-full h-px bg-white/10 mb-3"></div>
      
      <AnimatedEvent event={currentEvent} key={currentEvent.id} />
      
      <div className="mt-4 flex items-center space-x-2">
        <button 
          onClick={handlePrev} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Previous event"
        >
          <ArrowLeft size={14} className="text-gray-400" />
        </button>
        
        <input
          type="range"
          min="0"
          max={events.length - 1}
          value={currentIndex}
          onChange={handleScrubberChange}
          className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
        />
        
        <button 
          onClick={handleNext} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Next event"
        >
          <ArrowRight size={14} className="text-gray-400" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-1">
        {currentIndex + 1} of {events.length}
      </div>
    </div>
  );
};

interface AnimatedEventProps {
  event: ActivityEvent;
}

const AnimatedEvent: React.FC<AnimatedEventProps> = ({ event }) => {
  return (
    <motion.div
      className="flex justify-between items-center p-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 text-left">
        <h4 className="font-medium">{event.event}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>{event.time}</span>
          <span className="text-teal-400/70">({event.timeAgo})</span>
        </div>
      </div>
      <button className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors text-teal-300">
        Details
      </button>
    </motion.div>
  );
};

export default ActivityTimeline;
