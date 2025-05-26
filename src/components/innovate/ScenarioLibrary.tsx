
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface ScenarioLibraryProps {
  vertical?: boolean;
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ vertical = false, mode }) => {
  const { t } = useTranslation();

  return (
    <div className={`p-4 ${vertical ? 'h-full' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">{t('scenarioLibrary')}</h3>
      <div className={`${vertical ? 'flex flex-col space-y-4' : 'grid grid-cols-2 gap-4'}`}>
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-medium mb-2">Sample Scenario 1</h4>
          <p className="text-sm text-gray-400">Description for {mode} mode scenario</p>
        </div>
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-medium mb-2">Sample Scenario 2</h4>
          <p className="text-sm text-gray-400">Another scenario for {mode} mode</p>
        </div>
      </div>
    </div>
  );
};
