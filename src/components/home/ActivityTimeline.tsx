
import React from "react";
import { ActivityEvent } from "@/api/dashboard";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: ActivityEvent[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:to-blue-500/30">
      <div className="space-y-6 pt-2">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-2 pb-2">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-background border border-teal-500">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm">{activity.event}</span>
              <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
