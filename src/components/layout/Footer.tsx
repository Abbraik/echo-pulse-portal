
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="glass-panel mx-4 mb-4 mt-8 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link
          to="/help"
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </Link>
        <Link
          to="/docs"
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <BookOpen size={16} />
          <span>Docs</span>
        </Link>
        <Link
          to="/feedback"
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <MessageSquare size={16} />
          <span>Feedback</span>
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-white/10"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </footer>
  );
};

export default Footer;
