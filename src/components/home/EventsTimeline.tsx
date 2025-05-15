
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";

interface Event {
  id: number;
  date: string;
  title: string;
  type: "simulation" | "intervention" | "milestone";
  details: string;
}

// Sample events data
const events: Event[] = [
  {
    id: 1,
    date: "05/14",
    title: "Migration pilot launched",
    type: "intervention",
    details: "New migration policy simulation pilot launched in western regions"
  },
  {
    id: 2,
    date: "05/13",
    title: "NDI solver ran",
    type: "simulation",
    details: "National Dynamic Index solver completed with new parameters"
  },
  {
    id: 3,
    date: "05/10",
    title: "Education scenario completed",
    type: "milestone",
    details: "Education impact assessment completed for Q2 targets"
  },
  {
    id: 4,
    date: "05/07",
    title: "System calibration",
    type: "simulation",
    details: "Full system calibration against latest census data"
  },
  {
    id: 5,
    date: "05/03",
    title: "Migration framework updated",
    type: "intervention",
    details: "Migration framework parameters updated to reflect new research"
  }
];

const EventsTimeline = () => {
  const { t, isRTL } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [scrubPosition, setScrubPosition] = useState(50);
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case "simulation": return "bg-blue-500";
      case "intervention": return "bg-gold-500";
      case "milestone": return "bg-teal-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="mt-10">
      <GlassCard className="p-6" variant="deep">
        <GlassCardHeader>
          <GlassCardTitle gradient className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            System Events Record
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {/* Selected event details */}
          <motion.div 
            className="mb-6 overflow-hidden"
            animate={{ height: selectedEvent ? 'auto' : 0 }}
            initial={false}
          >
            {selectedEvent && (
              <div className="glass-panel p-4 rounded-lg">
                <h3 className="font-bold text-lg">{selectedEvent.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.details}</p>
              </div>
            )}
          </motion.div>
          
          {/* Timeline */}
          <div className="relative pt-6 pb-2">
            {/* Timeline track */}
            <div className="absolute left-0 right-0 h-0.5 bg-gray-700/30 top-10"></div>
            
            {/* Timeline events */}
            <div className="flex justify-between relative">
              {events.map((event) => (
                <motion.button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="relative flex flex-col items-center"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {/* Event dot */}
                  <motion.div 
                    className={`w-4 h-4 rounded-full ${getEventColor(event.type)} z-10 cursor-pointer`}
                    animate={{ 
                      scale: selectedEvent?.id === event.id ? 1.5 : 1,
                      boxShadow: selectedEvent?.id === event.id ? "0 0 0 4px rgba(20, 184, 166, 0.3)" : "none"
                    }}
                  />
                  
                  {/* Date label */}
                  <div className="text-xs mt-3 text-muted-foreground">{event.date}</div>
                </motion.button>
              ))}
            </div>
            
            {/* Scrubber */}
            <input 
              type="range"
              min="0"
              max="100"
              value={scrubPosition}
              onChange={(e) => setScrubPosition(parseInt(e.target.value))}
              className="timeline-scrubber absolute top-10 left-0 right-0 w-full z-20 transform -translate-y-1/2"
            />
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};

export default EventsTimeline;
