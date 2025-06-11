import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronDown, Sun, Moon, Globe, Search, X } from 'lucide-react';
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
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ hidden = false, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t, language, setLanguage, isRTL } = useTranslation();
  const [notifications] = useState(3); // Mock notification count
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Gooey navigation state
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeNavIndex, setActiveNavIndex] = useState<number>(0);

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

  // Update active nav index based on current path
  useEffect(() => {
    const currentIndex = navLinks.findIndex(link => link.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveNavIndex(currentIndex);
    }
  }, [location.pathname]);

  // Update gooey effect position when active index changes
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll("li")[activeNavIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add("active");
    }
    
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll("li")[activeNavIndex] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeNavIndex]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'THINK', path: '/think' },
    { name: 'ACT', path: '/act' },
    { name: 'MONITOR', path: '/monitor' },
    { name: 'LEARN', path: '/learn' },
    { name: 'INNOVATE', path: '/innovate' },
  ];

  // Gooey navigation helper functions
  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], 15 - i, 15),
      end: getXY(d[1] + noise(7), 15 - i, 15),
      time: t,
      scale: 1 + noise(0.2),
      color: Math.floor(Math.random() * 4) + 1,
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = [90, 10];
    const r = 100;
    const bubbleTime = 600 * 2 + 300;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    
    for (let i = 0; i < 15; i++) {
      const t = 600 * 2 + noise(300 * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {}
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    const liEl = e.currentTarget;
    if (activeNavIndex === index) return;
    setActiveNavIndex(index);
    updateEffectPosition(liEl);
    
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current!.removeChild(p));
    }
    
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <style>
        {`
          :root {
            --color-1: #14b8a6;
            --color-2: #3b82f6;
            --color-3: #8b5cf6;
            --color-4: #f59e0b;
          }
          .gooey-effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .gooey-effect.text {
            color: white;
            transition: color 0.3s ease;
          }
          .gooey-effect.text.active {
            color: #0f172a;
          }
          .gooey-effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .gooey-effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: #0f172a;
          }
          .gooey-effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, #14b8a6, #3b82f6);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .gooey-effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle, .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          .nav-item.active {
            color: #0f172a;
            text-shadow: none;
          }
          .nav-item.active::after {
            opacity: 1;
            transform: scale(1);
          }
          .nav-item::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background: linear-gradient(90deg, #14b8a6, #3b82f6);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>
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
                  POPULATION DYNAMICS SYSTEM
                </span>
              </NavLink>
            </div>

            {/* Gooey Navigation Links */}
            <div className={`hidden md:flex items-center justify-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`} ref={containerRef}>
              <nav className="flex relative" style={{ transform: "translate3d(0,0,0.01px)" }}>
                <ul
                  ref={navRef}
                  className="flex gap-8 list-none p-0 px-4 m-0 relative z-[3]"
                  style={{
                    color: "white",
                    textShadow: "0 1px 1px hsl(205deg 30% 10% / 0.2)",
                  }}
                >
                  {navLinks.map((link, index) => (
                    <li
                      key={link.path}
                      className={`nav-item py-[0.6em] px-[1em] rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white ${
                        activeNavIndex === index ? "active" : ""
                      }`}
                      onClick={(e) => handleNavClick(e, index)}
                    >
                      <NavLink
                        to={link.path}
                        className="outline-none"
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <span className="gooey-effect filter" ref={filterRef} />
              <span className="gooey-effect text" ref={textRef} />
            </div>

            {/* Utility Icons */}
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                aria-label="Search"
              >
                <Search size={18} className="text-gray-600 dark:text-gray-300" />
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 relative"
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
                  className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
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
                className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/10"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {resolvedTheme === 'dark' ? (
                    <motion.div
                      key="theme-moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} className="text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="theme-sun"
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
                    className="rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 flex items-center space-x-1"
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
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('profile')}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('settings')}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 text-gray-700 dark:text-gray-300">{t('support')}</DropdownMenuItem>
                  <DropdownMenuSeparator className={
                    resolvedTheme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                  } />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100"
                  >
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
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
    </>
  );
};

export default Navbar;
