
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  hidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hidden = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [notifications] = useState(3); // Mock notification count

  // Listen for scroll events
  React.useEffect(() => {
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
    { name: 'Home', path: '/' },
    { name: 'THINK', path: '/think' },
    { name: 'ACT', path: '/act' },
    { name: 'MONITOR', path: '/monitor' },
    { name: 'INNOVATE', path: '/innovate' },
  ];

  return (
    <AnimatePresence>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? resolvedTheme === 'dark' 
              ? 'bg-navy-900/80 backdrop-blur-lg shadow-lg' 
              : 'bg-white/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  PD
                </div>
                <span className="hidden md:block text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  Population Dynamics System
                </span>
              </NavLink>
            </div>

            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-300'
                          : resolvedTheme === 'dark'
                            ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                            : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                      }`
                    }
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                >
                  <Bell size={18} className="text-gray-300 dark:text-gray-300 light:text-gray-600" />
                </Button>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
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
                      <Moon size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 flex items-center space-x-1"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 mt-2 ${
                  resolvedTheme === 'dark' 
                    ? 'glass-panel-dark' 
                    : 'bg-white border-gray-200 shadow-md'
                }`}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  } />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100">Settings</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100">Support</DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  } />
                  <DropdownMenuItem className="text-red-400 cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
