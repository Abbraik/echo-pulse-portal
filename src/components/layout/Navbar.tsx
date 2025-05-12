
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronDown } from 'lucide-react';
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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

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
    { name: 'Home', path: '/' },
    { name: 'THINK', path: '/think' },
    { name: 'ACT', path: '/act' },
    { name: 'MONITOR', path: '/monitor' },
    { name: 'INNOVATE', path: '/innovate' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? resolvedTheme === 'dark' 
            ? 'bg-navy-900/80 backdrop-blur-lg shadow-lg' 
            : 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-teal-500">PDS</span>
              <span className="hidden md:block text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600">
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
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300'
                        : resolvedTheme === 'dark'
                          ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                          : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
            >
              <Bell size={18} className="text-gray-300 dark:text-gray-300 light:text-gray-600" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 flex items-center space-x-1"
                >
                  <div className="h-8 w-8 rounded-full bg-teal-600/30 flex items-center justify-center">
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
    </nav>
  );
};

export default Navbar;
