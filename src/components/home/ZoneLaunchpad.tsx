
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Activity, Monitor, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZoneTileProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  delay?: number;
}

const ZoneTile: React.FC<ZoneTileProps> = ({
  name,
  description,
  icon,
  path,
  color,
  delay = 0,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={() => navigate(path)}
      className="relative overflow-hidden glass-panel cursor-pointer hover-scale hover-lift p-6 flex flex-col"
    >
      {/* Background gradient */}
      <div 
        className={`absolute inset-0 opacity-20 bg-gradient-to-br ${color}`}
      ></div>

      {/* Icon */}
      <div className={`p-3 rounded-xl bg-white/10 w-fit ${color.replace('from', 'text').split(' ')[0]}`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mt-4">{name}</h3>
      <p className="text-sm text-gray-300 mt-2 flex-grow">{description}</p>

      {/* Action indicator */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs font-medium">Explore Zone</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "loop", 
            duration: 1.5,
            repeatDelay: 1
          }}
          className={`text-sm ${color.replace('from', 'text').split(' ')[0]}`}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
};

const ZoneLaunchpad: React.FC = () => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-6">Zones</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ZoneTile
          name="THINK"
          description="Analyze systems, model relationships, and identify patterns to understand the population dynamics."
          icon={<Layout size={24} />}
          path="/think"
          color="from-blue-500 to-blue-600"
          delay={0.1}
        />
        
        <ZoneTile
          name="ACT"
          description="Implement strategies, coordinate resources, and execute interventions based on insights."
          icon={<Activity size={24} />}
          path="/act"
          color="from-teal-500 to-teal-600"
          delay={0.2}
        />
        
        <ZoneTile
          name="MONITOR"
          description="Track metrics, spot trends, and receive alerts about changes in population dynamics."
          icon={<Monitor size={24} />}
          path="/monitor"
          color="from-amber-500 to-amber-600"
          delay={0.3}
        />
        
        <ZoneTile
          name="INNOVATE"
          description="Learn from interventions, adapt strategies, and develop new approaches to population challenges."
          icon={<Lightbulb size={24} />}
          path="/innovate"
          color="from-purple-500 to-purple-600"
          delay={0.4}
        />
      </div>
    </div>
  );
};

export default ZoneLaunchpad;
