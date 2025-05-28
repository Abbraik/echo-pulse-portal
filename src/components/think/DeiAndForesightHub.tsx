import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"

interface DeiAndForesightHubProps {
  // Define any props here
}

interface MainIndicator {
  name: string;
  score: number;
  target: number;
  trend: number[];
  subIndicators: SubIndicator[];
}

interface SubIndicator {
  name: string;
  value: number;
  unit: string;
  description: string;
  trend: number[];
  target?: number; // Add optional target property
}

const DeiAndForesightHub: React.FC<DeiAndForesightHubProps> = () => {
  const { t, isRTL } = useTranslation();

  // Mock Data
  const mainIndicators: MainIndicator[] = [
    {
      name: 'Equitable Access to Opportunities',
      score: 75,
      target: 85,
      trend: [60, 65, 70, 72, 75],
      subIndicators: [
        {
          name: 'Access to Education',
          value: 80,
          unit: '%',
          description: 'Percentage of population with access to quality education.',
          trend: [75, 77, 78, 79, 80],
          target: 90,
        },
        {
          name: 'Employment Rate',
          value: 70,
          unit: '%',
          description: 'Percentage of employable population currently employed.',
          trend: [65, 67, 68, 69, 70],
          target: 80,
        },
      ],
    },
    {
      name: 'Inclusive Social Environment',
      score: 68,
      target: 75,
      trend: [55, 60, 62, 65, 68],
      subIndicators: [
        {
          name: 'Social Cohesion Index',
          value: 72,
          unit: '',
          description: 'Index measuring the level of social cohesion within the community.',
          trend: [68, 69, 70, 71, 72],
          target: 80,
        },
        {
          name: 'Community Participation Rate',
          value: 64,
          unit: '%',
          description: 'Percentage of residents actively participating in community activities.',
          trend: [50, 55, 58, 60, 64],
          target: 70,
        },
      ],
    },
    {
      name: 'Fair Resource Distribution',
      score: 82,
      target: 90,
      trend: [70, 75, 78, 80, 82],
      subIndicators: [
        {
          name: 'Income Equality Ratio',
          value: 85,
          unit: '',
          description: 'Ratio measuring the equality of income distribution.',
          trend: [75, 80, 82, 84, 85],
          target: 95,
        },
        {
          name: 'Access to Healthcare',
          value: 80,
          unit: '%',
          description: 'Percentage of population with access to quality healthcare services.',
          trend: [70, 72, 75, 78, 80],
          target: 90,
        },
      ],
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center space-x-2">
        <Sparkles size={20} className="text-teal-500 animate-pulse" />
        <h2 className="text-lg font-bold">{t('deiAndForesightHub')}</h2>
        <Badge variant="secondary">Beta</Badge>
      </div>

      {/* Main Content */}
      <GlassCard className="p-6" variant="deep">
        <ScrollArea className="h-[65vh]">
          <div className="space-y-6">
            {mainIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Indicator Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">{indicator.name}</h3>
                  <div className="text-sm text-gray-400">
                    Score: {indicator.score} / Target: {indicator.target}
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={indicator.score} max={100} className="h-2" />

                {/* Sub-indicators */}
                <div className="space-y-2 pl-4">
                  {indicator.subIndicators.map((sub, subIndex) => (
                    <motion.div
                      key={subIndex}
                      className="glass-panel p-3 rounded-md border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + subIndex * 0.05 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{sub.name}</div>
                        <div className="text-xs text-gray-400">
                          {sub.value} {sub.unit} / Target: {sub.target}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{sub.description}</p>
                      <Progress value={sub.value} max={100} className="h-1 mt-2" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </GlassCard>
    </section>
  );
};

export default DeiAndForesightHub;
