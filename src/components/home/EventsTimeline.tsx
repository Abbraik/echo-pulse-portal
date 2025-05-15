
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ParallaxCard } from "@/components/ui/parallax-card";

interface Event {
  id: number;
  date: string;
  title: string;
  type: "simulation" | "intervention" | "milestone";
  details: string;
}

// Sample events data in three columns
const eventColumns: { title: string, events: Event[] }[] = [
  {
    title: "Previous Month",
    events: [
      {
        id: 1,
        date: "04/15",
        title: "System calibration",
        type: "simulation",
        details: "Full system calibration against latest census data"
      },
      {
        id: 2,
        date: "04/21",
        title: "Migration framework updated",
        type: "intervention",
        details: "Migration framework parameters updated to reflect new research"
      },
      {
        id: 3,
        date: "04/28",
        title: "Q1 Reporting",
        type: "milestone",
        details: "Quarterly model validation and adjustment session with stakeholders"
      }
    ]
  },
  {
    title: "Current Month",
    events: [
      {
        id: 4,
        date: "05/03",
        title: "NDI solver ran",
        type: "simulation",
        details: "National Dynamic Index solver completed with new parameters"
      },
      {
        id: 5,
        date: "05/07",
        title: "Education scenario completed",
        type: "milestone",
        details: "Education impact assessment completed for Q2 targets"
      },
      {
        id: 6,
        date: "05/14",
        title: "Migration pilot launched",
        type: "intervention",
        details: "New migration policy simulation pilot launched in western regions"
      }
    ]
  },
  {
    title: "Upcoming",
    events: [
      {
        id: 7,
        date: "06/01",
        title: "System upgrade",
        type: "simulation",
        details: "Planned system upgrade to v3.1.4 with enhanced decision trees"
      },
      {
        id: 8,
        date: "06/09",
        title: "Regional framework",
        type: "intervention",
        details: "Regional framework parameter updates scheduled"
      },
      {
        id: 9,
        date: "06/15",
        title: "Milestone presentation",
        type: "milestone",
        details: "Stakeholder presentation of Q2 adaptations and projections"
      }
    ]
  }
];

const EventsTimeline: React.FC = () => {
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
    <ParallaxCard>
      <GlassCard className="p-6" variant="deep">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle gradient className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {t('systemEventsRecord')}
            </GlassCardTitle>
            <Button variant="outline" size="sm">
              View Full Timeline
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          {/* Selected event details */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`glass-panel p-4 rounded-lg border-l-4 border-${selectedEvent.type === 'simulation' ? 'blue' : selectedEvent.type === 'intervention' ? 'gold' : 'teal'}-500`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{selectedEvent.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedEvent.details}</p>
                    </div>
                    <div className={`text-${selectedEvent.type === 'simulation' ? 'blue' : selectedEvent.type === 'intervention' ? 'gold' : 'teal'}-500 text-sm font-medium`}>
                      {selectedEvent.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Timeline columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {eventColumns.map((column, colIndex) => (
              <div key={colIndex} className="space-y-4">
                <h3 className="font-medium text-center text-muted-foreground text-sm">{column.title}</h3>
                {column.events.map((event) => (
                  <motion.button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-lg border-l-2 transition-all duration-200 ${selectedEvent?.id === event.id ? `bg-${event.type === 'simulation' ? 'blue' : event.type === 'intervention' ? 'gold' : 'teal'}-500/10 border-${event.type === 'simulation' ? 'blue' : event.type === 'intervention' ? 'gold' : 'teal'}-500` : `border-${event.type === 'simulation' ? 'blue' : event.type === 'intervention' ? 'gold' : 'teal'}-500/30`}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${getEventColor(event.type)} mr-3`}></div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 opacity-50 ${selectedEvent?.id === event.id ? 'rotate-90' : ''} transition-transform duration-200`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
          
          {/* Timeline scrubber */}
          <div className="relative pt-6 pb-2">
            {/* Timeline track with event markers */}
            <div className="relative">
              <div className="absolute left-0 right-0 h-0.5 bg-gray-700/30 top-0"></div>
              
              {/* Timeline event dots */}
              <div className="absolute left-0 right-0 top-0 h-0 flex justify-between">
                {eventColumns.flatMap(column => column.events).map((event, idx) => (
                  <div 
                    key={event.id} 
                    className={`-mt-[4px] h-2 w-2 rounded-full ${getEventColor(event.type)} ${selectedEvent?.id === event.id ? 'ring-2 ring-offset-2 ring-offset-background ring-white/30' : ''}`}
                    style={{ 
                      left: `calc(${(idx / (eventColumns.flat().length - 1)) * 100}% - 4px)`,
                      position: 'absolute'
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Slider control */}
              <Slider
                value={[scrubPosition]}
                onValueChange={(values) => setScrubPosition(values[0])}
                max={100}
                step={1}
                className="pt-4"
              />
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default EventsTimeline;
