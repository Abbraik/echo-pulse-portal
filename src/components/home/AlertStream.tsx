
import React from "react";
import { Alert } from "@/api/dashboard";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface AlertStreamProps {
  alerts: Alert[];
}

const AlertStream: React.FC<AlertStreamProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getAlertClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-amber-500 bg-amber-500/5';
      case 'error':
        return 'border-l-rose-500 bg-rose-500/5';
      case 'info':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'success':
        return 'border-l-emerald-500 bg-emerald-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };
  
  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const time = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });
        
        return (
          <div
            key={alert.id}
            className={cn(
              "p-3 rounded-lg border-l-4 transition-all duration-300 hover:translate-x-1",
              getAlertClass(alert.type)
            )}
          >
            <div className="flex items-start">
              <div className="mr-3">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              {alert.isNew && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  New
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertStream;
