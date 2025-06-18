
import React from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/ui/particles-background';

const MonitorBackground: React.FC = () => {
  return (
    <>
      <ParticlesBackground 
        count={70}
        colorStart="#14B8A6"
        colorEnd="#2563EB"
        minSize={2}
        maxSize={5}
        speed={0.4}
      />

      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
        <motion.div 
          className="absolute inset-0 opacity-50" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </>
  );
};

export default MonitorBackground;
