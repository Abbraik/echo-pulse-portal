import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeatureFlags {
  newRgsUI: boolean;
  newRgsAdvancedSettings: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  toggleFlag: (key: keyof FeatureFlags) => void;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

const defaultFlags: FeatureFlags = {
  newRgsUI: false,
  newRgsAdvancedSettings: false,
};

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const stored = localStorage.getItem('rgs-feature-flags');
    if (stored) {
      try {
        return { ...defaultFlags, ...JSON.parse(stored) };
      } catch {
        return defaultFlags;
      }
    }
    return defaultFlags;
  });

  useEffect(() => {
    localStorage.setItem('rgs-feature-flags', JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (key: keyof FeatureFlags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag, setFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};