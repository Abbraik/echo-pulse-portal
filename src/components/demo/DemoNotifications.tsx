
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoManager } from '@/hooks/use-demo-manager';

export const DemoNotifications: React.FC = () => {
  const { notifications, removeNotification } = useDemoManager();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-400/50';
      case 'warning':
        return 'border-yellow-400/50';
      case 'error':
        return 'border-red-400/50';
      default:
        return 'border-blue-400/50';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-[1002] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className={`bg-white/10 backdrop-blur-xl border rounded-lg p-3 ${getBorderColor(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-medium text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-300">
                  {notification.message}
                </p>
                {notification.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={notification.action.handler}
                    className="mt-2 h-6 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white p-0 h-4 w-4"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
