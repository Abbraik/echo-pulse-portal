
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const RoleBanner: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="glass-panel-cinematic h-full flex items-center justify-between px-8">
      {/* Welcome Section */}
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Avatar className="h-12 w-12 border-2 border-teal-400/50">
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
          <AvatarFallback className="bg-teal-500/20 text-teal-400">
            <User size={20} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
            {language === 'en' ? 'Welcome, Secretary General' : 'مرحباً، الأمين العام'}
          </h1>
          <p className="text-sm text-gray-300">
            {language === 'en' ? 'Strategic Command Center' : 'مركز القيادة الاستراتيجية'}
          </p>
        </div>
      </motion.div>

      {/* Control Section */}
      <motion.div 
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleLanguage}
          className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white"
        >
          <Globe size={16} className="mr-2" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleTheme}
          className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </motion.div>
    </div>
  );
};

export default RoleBanner;
