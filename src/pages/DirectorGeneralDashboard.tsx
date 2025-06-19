
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import EnhancedDynamicDashboard from '@/components/dashboard/EnhancedDynamicDashboard';

const DirectorGeneralDashboard: React.FC = () => {
  return (
    <AnimatedPage>
      <EnhancedDynamicDashboard />
    </AnimatedPage>
  );
};

export default DirectorGeneralDashboard;
