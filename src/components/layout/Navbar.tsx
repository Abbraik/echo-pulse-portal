import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronDown, Sun, Moon, Globe, Search, X, Play } from 'lucide-react';
import { ViewToggle } from './ViewToggle';
import { Button } from '@/components/ui/button';
import { PulseBar } from './PulseBar';
import { RoleToggle, type UserRole } from './RoleToggle';
import { ReflexEngineStatus } from './ReflexEngineStatus';
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
import { useUIContent } from '@/hooks/use-ui-content';
import { useDemo } from '@/hooks/use-demo';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NavbarProps {
  hidden?: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ hidden = false, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRole, setCurrentRole] = useState<UserRole>('Champion');
  const [reflexEngineActive, setReflexEngineActive] = useState(true);
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t, language, setLanguage, isRTL } = useTranslation();
  const { getContent } = useUIContent('global', 'navigation');
  const [notifications] = useState(3);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const { isDemoMode, toggleDemoMode } = useDemo();
  const { flags, toggleFlag } = useFeatureFlags();

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

  // Handle keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSearch(true);
      }
      
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const navLinks = [
    { name: getContent('nav.home', 'HOME'), path: '/' },
    { name: getContent('nav.think', 'THINK'), path: '/think' },
    { name: getContent('nav.act', 'ACT'), path: '/act' },
    { name: getContent('nav.monitor', 'MONITOR'), path: '/monitor' },
    { name: getContent('nav.learn', 'LEARN'), path: '/learn' },
    { name: getContent('nav.innovate', 'INNOVATE'), path: '/innovate' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <AnimatePresence>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? resolvedTheme === 'dark' 
              ? 'bg-navy-900/80 backdrop-blur-lg shadow-lg' 
              : 'bg-white/90 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Brand Logo & Title */}
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <NavLink to="/" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold relative overflow-hidden group">
                  <span className="relative z-10">PD</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="hidden md:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  {getContent('homepage.title', 'POPULATION DYNAMICS SYSTEM')}
                </span>
              </NavLink>
            </div>

            {/* Navigation Links */}
            <div className={`hidden md:flex items-center justify-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-8`}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `group relative px-3 py-2 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'text-teal-600 dark:text-teal-400'
                          : resolvedTheme === 'dark'
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                      }`
                    }
                    onMouseEnter={() => setIsHovering(link.path)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    {link.name}
                    {/* Hover underline */}
                    {isHovering === link.path && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-teal-500/60 to-blue-600/60"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Utility Icons */}
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Role Toggle */}
              <RoleToggle currentRole={currentRole} onRoleChange={setCurrentRole} />
              
              {/* Reflex Engine Status */}
              <ReflexEngineStatus 
                isActive={reflexEngineActive} 
                onToggle={() => setReflexEngineActive(!reflexEngineActive)} 
              />
              
              {/* View Toggle */}
              <ViewToggle />

              {/* Demo Mode Toggle */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDemoMode}
                  className={`rounded-full hover:bg-white/5 dark:hover:bg-white/5 ${
                    isDemoMode ? 'bg-teal-500/20 text-teal-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                  aria-label="Toggle Demo Mode"
                >
                  <Play size={18} className={isDemoMode ? 'text-teal-400' : ''} />
                </Button>
                {isDemoMode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-3 w-3 bg-teal-500 rounded-full flex items-center justify-center"
                  >
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5"
                aria-label="Search"
              >
                <Search size={18} className="text-gray-600 dark:text-gray-300" />
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 relative"
                aria-label="Toggle language"
              >
                <Globe size={18} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {language === 'en' ? 'AR' : 'EN'}
                </span>
              </Button>
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/5 dark:hover:bg-white/5"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
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
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5"
                aria-label="Toggle theme"
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
                      <Sun size={18} className="text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 flex items-center space-x-1"
                    aria-label="User menu"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-teal-500/30 flex items-center justify-center">
                      <User size={16} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <ChevronDown size={14} className="text-gray-700 dark:text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 mt-2 ${
                  resolvedTheme === 'dark' 
                    ? 'glass-panel-dark' 
                    : 'bg-white border-gray-300 shadow-md'
                }`}>
                  <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">{t('myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                  } />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300">{t('profile')}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300">{t('settings')}</DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                  } />
                  <div className="px-2 py-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-rgs-ui" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        New RGS UI
                      </Label>
                      <Switch
                        id="new-rgs-ui"
                        checked={flags.newRgsUI}
                        onCheckedChange={() => toggleFlag('newRgsUI')}
                      />
                    </div>
                    {flags.newRgsUI && (
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advanced-settings" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Advanced Features
                        </Label>
                        <Switch
                          id="advanced-settings"
                          checked={flags.newRgsAdvancedSettings}
                          onCheckedChange={() => toggleFlag('newRgsAdvancedSettings')}
                        />
                      </div>
                    )}
                  </div>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300">{t('support')}</DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                  } />
                  <DropdownMenuItem 
                    onClick={toggleDemoMode}
                    className={`cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 ${
                      isDemoMode ? 'text-teal-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isDemoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                  } />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-white/5 dark:hover:bg-white/5"
                  >
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-white/5 dark:hover:bg-white/5"
                aria-label="Mobile menu"
              >
                <Menu size={20} className="text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Popup Overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-2xl mx-4"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Global Search</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search across all zones..."
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    autoFocus
                  />
                </form>
                <div className="mt-4 text-sm text-gray-400">
                  Press <kbd className="bg-white/10 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded">F</kbd> to search, <kbd className="bg-white/10 px-2 py-1 rounded">Esc</kbd> to close
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
