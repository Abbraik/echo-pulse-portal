
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

// Update the type to include all possible status values
type SystemStatusType = 'operational' | 'degraded' | 'outage';

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const { t, isRTL } = useTranslation();
  const appVersion = "v4.0.0"; // Mock version number
  const systemStatus: SystemStatusType = "operational"; // Mock status: operational, degraded, outage

  const getStatusColor = () => {
    if (systemStatus === "operational") return "bg-green-500";
    if (systemStatus === "degraded") return "bg-amber-500";
    if (systemStatus === "outage") return "bg-red-500";
    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (systemStatus === "operational") return t('allSystemsGo');
    if (systemStatus === "degraded") return t('performanceIssues');
    return t('systemOutage');
  };

  return (
    <footer className={`glass-panel mx-4 mb-4 mt-8 py-4 px-6 ${isRTL ? 'rtl' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={`text-sm text-gray-600 dark:text-gray-400 light:text-gray-600 ${isRTL ? 'font-noto-arabic' : ''}`}>
          {t('copyright')}
        </div>
        
        <div className="flex items-center space-x-6">
          <Link
            to="/help"
            className={`flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 ${isRTL ? 'space-x-reverse' : ''}`}
          >
            <HelpCircle size={16} />
            <span className={`relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isRTL ? 'font-noto-arabic' : ''}`}>
              {t('help', { defaultValue: 'Help' })}
            </span>
          </Link>
          <Link
            to="/docs"
            className={`flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 ${isRTL ? 'space-x-reverse' : ''}`}
          >
            <BookOpen size={16} />
            <span className={`relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isRTL ? 'font-noto-arabic' : ''}`}>
              {t('documentation', { defaultValue: 'Documentation' })}
            </span>
          </Link>
          <Link
            to="/feedback"
            className={`flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 ${isRTL ? 'space-x-reverse' : ''}`}
          >
            <MessageSquare size={16} />
            <span className={`relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isRTL ? 'font-noto-arabic' : ''}`}>
              {t('feedback', { defaultValue: 'Feedback' })}
            </span>
          </Link>
        </div>
        
        <div className={`flex items-center space-x-2 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
          <span className="text-gray-600 dark:text-gray-400">{appVersion}</span>
          <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor()}`}></span>
            <span className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'font-noto-arabic' : ''}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
