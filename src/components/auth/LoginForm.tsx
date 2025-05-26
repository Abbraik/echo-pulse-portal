
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface LoginFormProps {
  onLoginSuccess: (email: string, requiresMfa: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLoginSuccess, 
  onForgotPassword 
}) => {
  const { t, isRTL } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = t('emailRequired', { defaultValue: 'Email is required' });
    } else if (!validateEmail(email)) {
      newErrors.email = t('invalidEmailFormat', { defaultValue: 'Invalid email format' });
    }
    
    if (!password) {
      newErrors.password = t('passwordRequired', { defaultValue: 'Password is required' });
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate login API call
      setTimeout(() => {
        setIsLoading(false);
        // Mock MFA requirement for demo
        const requiresMfa = email.includes('mfa');
        onLoginSuccess(email, requiresMfa);
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <div className="relative">
          <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-teal-400`} />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailAddress', { defaultValue: 'Email address' })}
            className={`
              ${isRTL ? 'pr-10 text-right' : 'pl-10'} 
              bg-white/10 border-teal-500/30 text-white placeholder:text-white/50
              focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20
              ${errors.email ? 'border-red-400' : ''}
            `}
            aria-label={t('emailAddress', { defaultValue: 'Email address' })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-red-400 text-sm" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="relative">
          <Lock className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-teal-400`} />
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password', { defaultValue: 'Password' })}
            className={`
              ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} 
              bg-white/10 border-teal-500/30 text-white placeholder:text-white/50
              focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20
              ${errors.password ? 'border-red-400' : ''}
            `}
            aria-label={t('password', { defaultValue: 'Password' })}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : 'password-strength'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-teal-400 hover:text-teal-300`}
            aria-label={showPassword ? t('hidePassword', { defaultValue: 'Hide password' }) : t('showPassword', { defaultValue: 'Show password' })}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-red-400 text-sm" role="alert">
            {errors.password}
          </p>
        )}
        {password && !errors.password && (
          <PasswordStrengthMeter password={password} />
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="border-teal-500/30 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white"
        />
        <label 
          htmlFor="remember-me" 
          className="text-sm text-white/80 cursor-pointer"
        >
          {t('keepMeSignedIn', { defaultValue: 'Keep me signed in' })}
        </label>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 btn-primary-glow text-white font-semibold relative overflow-hidden"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          t('signIn', { defaultValue: 'Sign In' })
        )}
      </Button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors underline-offset-4 hover:underline"
        >
          {t('forgotPassword', { defaultValue: 'Forgot password?' })}
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-sm text-white/60">
          {t('newUser', { defaultValue: 'New user?' })}{' '}
          <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors underline-offset-4 hover:underline">
            {t('createAccount', { defaultValue: 'Create an account' })}
          </a>
        </p>
      </div>
    </form>
  );
};
