
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { t } = useTranslation();

  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 3) {
      return { 
        score, 
        label: t('passwordWeak', { defaultValue: 'Weak' }), 
        color: 'bg-red-500' 
      };
    } else if (score < 5) {
      return { 
        score, 
        label: t('passwordMedium', { defaultValue: 'Medium' }), 
        color: 'bg-yellow-500' 
      };
    } else {
      return { 
        score, 
        label: t('passwordStrong', { defaultValue: 'Strong' }), 
        color: 'bg-green-500' 
      };
    }
  };

  const { score, label, color } = calculateStrength(password);
  const strengthPercentage = (score / 6) * 100;

  return (
    <div id="password-strength" className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/60">
          {t('passwordStrength', { defaultValue: 'Password strength' })}
        </span>
        <span className={`text-xs font-medium ${
          color === 'bg-red-500' ? 'text-red-400' : 
          color === 'bg-yellow-500' ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {label}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${strengthPercentage}%` }}
          role="progressbar"
          aria-valuenow={strengthPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${t('passwordStrength', { defaultValue: 'Password strength' })}: ${label}`}
        />
      </div>
    </div>
  );
};
