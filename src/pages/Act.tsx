
import React from 'react';
import ActHeader from '@/components/act/layout/ActHeader';
import ActBackground from '@/components/act/layout/ActBackground';
import ActMainContent from '@/components/act/layout/ActMainContent';
import ActScrollToTop from '@/components/act/layout/ActScrollToTop';
import { DemoActContextPanel } from '@/components/act/DemoActContextPanel';

const Act = () => {
  return (
    <div className="relative min-h-screen">
      <ActBackground />
      <div className="relative z-10">
        <ActHeader />
        <div className="container mx-auto px-4 py-8">
          <DemoActContextPanel />
          <ActMainContent />
        </div>
        <ActScrollToTop />
      </div>
    </div>
  );
};

export default Act;
