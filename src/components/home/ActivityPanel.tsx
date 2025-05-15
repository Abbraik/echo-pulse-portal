
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { ActivityEvent } from "@/api/dashboard";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityPanelProps {
  activities: ActivityEvent[];
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities }) => {
  const { t } = useTranslation();

  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full" variant="deep">
        <GlassCardHeader>
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-teal-400" />
            <GlassCardTitle gradient>{t('activityTitle')}</GlassCardTitle>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="p-3 rounded-lg border-l-2 border-teal-500/50 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{activity.event}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{activity.timeAgo}</span>
                      </div>
                    </div>
                    <div className="rounded-full bg-teal-500/10 px-2 py-1 text-xs text-teal-400">
                      {activity.type}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default ActivityPanel;
