
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronDown, Sun, Moon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  hidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hidden = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t, language, setLanguage, isRTL } = useTranslation();
  const [notifications] = useState(3); // Mock notification count
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navLinks = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.think'), path: '/think' },
    { name: t('navigation.act'), path: '/act' },
    { name: t('navigation.monitor'), path: '/monitor' },
    { name: t('navigation.learn'), path: '/learn' },
    { name: t('navigation.innovate'), path: '/innovate' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <AnimatePresence>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? resolvedTheme === 'dark' 
              ? 'bg-navy-900/80 backdrop-blur-lg shadow-lg' 
              : 'bg-white/90 backdrop-blur-lg shadow-lg' // Increased opacity for better contrast
            : 'bg-transparent'
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <NavLink to="/" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold relative overflow-hidden group">
                  <span className="relative z-10">PD</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="hidden md:block text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  {t('appName')}
                </span>
              </NavLink>
            </div>

            <div className={`hidden md:flex items-center justify-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-1`}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-teal-500/30 text-teal-700 dark:text-teal-300' // Better contrast in light mode
                          : resolvedTheme === 'dark'
                            ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                            : 'text-gray-700 hover:bg-black/10 hover:text-gray-900' // Darker text for better contrast
                      }`
                    }
                    onMouseEnter={() => setIsHovering(link.path)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    {link.name}
                    {isHovering === link.path && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-teal-500 to-blue-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 relative"
              >
                <Globe size={18} className="text-gray-600 dark:text-gray-300" /> {/* Darker color for better contrast */}
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {language === 'en' ? 'AR' : 'EN'}
                </span>
              </Button>
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" /> {/* Darker color for better contrast */}
                </Button>
                {notifications > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-xs text-white"
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </motion.span>
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/10"
              >
                <AnimatePresence mode="wait">
                  {resolvedTheme === 'dark' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} className="text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} className="text-gray-600" /> {/* Darker color for better contrast */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 flex items-center space-x-1"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-teal-500/30 flex items-center justify-center">
                      <User size={16} className="text-gray-700 dark:text-gray-300" /> {/* Darker color for better contrast */}
                    </div>
                    <ChevronDown size={14} className="text-gray-700 dark:text-gray-300" /> {/* Darker color for better contrast */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 mt-2 ${
                  resolvedTheme === 'dark' 
                    ? 'glass-panel-dark' 
                    : 'bg-white border-gray-300 shadow-md' /* Darker border for better contrast */
                }`}>
                  <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">{t('myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300' /* Darker separator for better contrast */
                  } />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('profile')}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('settings')}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('support')}</DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300' /* Darker separator for better contrast */
                  } />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100">
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
              >
                <Menu size={20} className="text-gray-700 dark:text-gray-300" /> {/* Darker color for better contrast */}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
