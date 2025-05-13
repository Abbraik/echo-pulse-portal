
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

// Update the type to include all possible status values
type SystemStatusType = 'operational' | 'degraded' | 'outage';

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const appVersion = "v4.0.0"; // Mock version number
  const systemStatus: SystemStatusType = "operational"; // Mock status: operational, degraded, outage

  const getStatusColor = () => {
    if (systemStatus === "operational") return "bg-green-500";
    if (systemStatus === "degraded") return "bg-amber-500";
    if (systemStatus === "outage") return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <footer className="glass-panel mx-4 mb-4 mt-8 py-4 px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 light:text-gray-600">
          © 2025 Population Dynamics System
        </div>
        
        <div className="flex items-center space-x-6">
          <Link
            to="/help"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
          >
            <HelpCircle size={16} />
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Help
            </span>
          </Link>
          <Link
            to="/docs"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
          >
            <BookOpen size={16} />
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Documentation
            </span>
          </Link>
          <Link
            to="/feedback"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
          >
            <MessageSquare size={16} />
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-teal-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Feedback
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">{appVersion}</span>
          <div className="flex items-center space-x-1">
            <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor()}`}></span>
            <span className="text-gray-600 dark:text-gray-400">
              {systemStatus === "operational" ? "All systems go" : 
               systemStatus === "degraded" ? "Performance issues" : "System outage"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
