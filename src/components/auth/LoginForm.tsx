
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';

interface LoginFormProps {
  onLoginSuccess: (email: string, requiresMfa: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief loading state for demonstration
    setTimeout(() => {
      setIsLoading(false);
      // Auto-login without credential validation for demo purposes
      onLoginSuccess('demo@example.com', false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white/80">
          {t('email', { defaultValue: 'Email' })}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
            placeholder={t('enterEmail', { defaultValue: 'Enter your email' })}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-white/80">
          {t('password', { defaultValue: 'Password' })}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
            placeholder={t('enterPassword', { defaultValue: 'Enter your password' })}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          disabled={isLoading}
        >
          {t('forgotPassword', { defaultValue: 'Forgot password?' })}
        </button>
      </div>

      {/* Demo Notice */}
      <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 text-center">
        <p className="text-sm text-teal-300">
          {t('demoMode', { defaultValue: 'Demo Mode - Click Sign In to continue' })}
        </p>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <span>{t('signIn', { defaultValue: 'Sign In' })}</span>
            <ArrowRight size={18} />
          </>
        )}
      </Button>
    </form>
  );
};
