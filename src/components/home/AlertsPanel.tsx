
import React from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert } from "@/api/dashboard";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts = [] }) => {
  const { t } = useTranslation();

  const getAlertColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'gold';
      case 'medium':
        return 'teal';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full" variant="deep">
        <GlassCardHeader>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-teal-400" />
            <GlassCardTitle gradient>{t('alertStream')}</GlassCardTitle>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <p>{t('noAlertsAvailable', { defaultValue: 'No alerts available' })}</p>
                </div>
              ) : (
                alerts.slice(0, 3).map((alert) => {
                  const color = getAlertColor(alert.priority);
                  
                  return (
                    <motion.div
                      key={alert.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${color}-500/20 text-${color}-500`}>
                            {alert.priority} Priority
                          </div>
                          <h4 className="font-medium text-base">{alert.message}</h4>
                          <p className="text-sm text-muted-foreground">{alert.details}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Recalibrate
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2 text-xs">
                          <span>Consider</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default AlertsPanel;
