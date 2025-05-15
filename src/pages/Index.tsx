
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Globe, Layers, Cpu, BarChart, Zap, Users } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b dark:from-navy-900/80 dark:to-navy-900 from-blue-50/80 to-white"></div>
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-teal-500/10 animate-float-subtle"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
            }}
          />
        ))}
    </div>
  );
};

const ZoneCard = ({ icon: Icon, title, description, color, delay = 0 }) => {
  const { isRTL } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative"
    >
      <Card className={`glass-panel-deep hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-white/20 ${isRTL ? 'rtl' : ''}`}>
        <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        <CardContent className="p-6 flex flex-col items-center text-center h-full">
          <div className="relative mb-4">
            <div className={`absolute inset-0 blur-xl ${color} opacity-20 group-hover:opacity-30 transition-all duration-300`}></div>
            <div className={`relative z-10 h-12 w-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
              <Icon size={24} className={`${color} text-opacity-80`} />
            </div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isRTL ? 'font-noto-arabic' : ''}`}>{title}</h3>
          <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'font-noto-arabic' : ''}`}>{description}</p>
          <div className="mt-auto">
            <Button variant="ghost" size="sm" className={`group-hover:translate-x-1 transition-transform duration-300 ${isRTL ? 'font-noto-arabic flex-row-reverse' : ''}`}>
              {isRTL ? <ChevronRight size={16} className="mr-1 transform rotate-180" /> : null}
              {isRTL ? 'استكشاف' : 'Explore'}
              {!isRTL ? <ChevronRight size={16} className="ml-1" /> : null}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GlowingButton = ({ children, ...props }) => {
  return (
    <button
      className="relative px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg text-white font-medium group overflow-hidden"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-white/20"></span>
    </button>
  );
};

const Index: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simulating content loading for animation purposes
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  const zones = [
    { 
      icon: Heart, 
      title: t('home'), 
      description: t('homeDesc'), 
      color: "text-teal-500",
      path: "/home"
    },
    { 
      icon: Globe, 
      title: t('think'), 
      description: t('thinkDesc'), 
      color: "text-blue-500",
      path: "/think"
    },
    { 
      icon: Layers, 
      title: t('act'), 
      description: t('actDesc'), 
      color: "text-indigo-500",
      path: "/act"
    },
    { 
      icon: BarChart, 
      title: t('monitor'), 
      description: t('monitorDesc'), 
      color: "text-violet-500",
      path: "/monitor"
    },
    { 
      icon: Zap, 
      title: t('innovate'), 
      description: t('innovateDesc'), 
      color: "text-fuchsia-500",
      path: "/innovate"
    },
    { 
      icon: Cpu, 
      title: t('sandbox'), 
      description: t('sandboxDesc'), 
      color: "text-rose-500",
      path: "/sandbox"
    },
  ];

  return (
    <div className={`min-h-screen w-full relative pb-20 ${isRTL ? 'rtl' : ''}`}>
      <ParticleBackground />
      
      <AnimatePresence>
        {isVisible && (
          <div className="container mx-auto px-4 pt-12 pb-20 relative z-10">
            {/* Hero Section with animated text */}
            <motion.section 
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className={`text-4xl md:text-6xl font-black mb-6 ${isRTL ? 'font-noto-arabic' : ''}`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="hero-heading">{t('heroTitle')}</span>
              </motion.h1>
              
              <motion.p 
                className={`max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 ${isRTL ? 'font-noto-arabic' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {t('heroSubtitle')}
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <GlowingButton onClick={() => navigate('/home')} className={isRTL ? 'font-noto-arabic' : ''}>
                  {t('launchDashboard')}
                </GlowingButton>
                
                <Button variant="outline" className={`border-white/20 backdrop-blur-sm hover:bg-white/10 ${isRTL ? 'font-noto-arabic' : ''}`}>
                  {t('learnMore')}
                </Button>
              </motion.div>
            </motion.section>
            
            {/* Featured Phase Indicator */}
            <motion.div 
              className="relative max-w-md mx-auto mb-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className={`glass-panel-deep py-4 px-6 ${isRTL ? 'rtl' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl"></div>
                <div className="flex items-center justify-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 animate-pulse"></span>
                  <span className={isRTL ? 'font-noto-arabic' : ''}>
                    {t('currentPhase')}{' '}
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                      {t('optimization')}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {zones.map((zone, idx) => (
                <div key={zone.title} onClick={() => navigate(zone.path)} className="cursor-pointer">
                  <ZoneCard 
                    icon={zone.icon} 
                    title={zone.title}
                    description={zone.description}
                    color={zone.color}
                    delay={0.2 + idx * 0.1}
                  />
                </div>
              ))}
            </div>
            
            {/* System Status Card */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className={`glass-panel-deep p-6 overflow-hidden ${isRTL ? 'rtl' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-2xl"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                    <h3 className={`text-xl font-bold mb-2 ${isRTL ? 'font-noto-arabic' : ''}`}>{t('systemStatus')}</h3>
                    <p className={`text-muted-foreground text-sm mb-4 ${isRTL ? 'font-noto-arabic' : ''}`}>{t('allSystemsOperational')}</p>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
                        <span className={`text-xs text-muted-foreground ${isRTL ? 'font-noto-arabic' : ''}`}>{t('dataProcessing')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
                        <span className={`text-xs text-muted-foreground ${isRTL ? 'font-noto-arabic' : ''}`}>{t('analysisEngine')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
                        <span className={`text-xs text-muted-foreground ${isRTL ? 'font-noto-arabic' : ''}`}>{t('visualizationAPI')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-pulse blur-xl"></div>
                    <div className="relative z-10 h-full w-full rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users size={20} className="text-teal-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Navigation Ribbon */}
      <div className="nav-ribbon">
        {zones.map((zone) => (
          <button 
            key={zone.title}
            onClick={() => navigate(zone.path)}
            className={`nav-ribbon-item ${
              window.location.pathname === zone.path ? 'nav-ribbon-item-active' : ''
            } ${isRTL ? 'font-noto-arabic flex-row-reverse' : ''}`}
          >
            <zone.icon size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
            <span>{zone.title === t('home') ? t('home') : zone.title.charAt(0)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
