
import React from 'react';
import { DemoOverlay } from './DemoOverlay';
import { DemoControlPanel } from './DemoControlPanel';
import { DemoNotifications } from './DemoNotifications';
import { useDemoManager } from '@/hooks/use-demo-manager';

export const DemoSystem: React.FC = () => {
  const { isDemoMode } = useDemoManager();

  if (!isDemoMode) return null;

  return (
    <>
      <DemoOverlay />
      <DemoControlPanel />
      <DemoNotifications />
    </>
  );
};
