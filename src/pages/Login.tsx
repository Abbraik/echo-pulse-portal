
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { LoginForm } from '@/components/auth/LoginForm';
import { MfaChallenge } from '@/components/auth/MfaChallenge';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import LanguageToggle from '@/components/home/LanguageToggle';
import ThemeToggle from '@/components/home/ThemeToggle';

type AuthStep = 'login' | 'mfa' | 'success';

const Login: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [userEmail, setUserEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginSuccess = (email: string, requiresMfa: boolean) => {
    setUserEmail(email);
    if (requiresMfa) {
      setCurrentStep('mfa');
    } else {
      setCurrentStep('success');
      // Redirect to main app after brief delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const handleMfaSuccess = () => {
    setCurrentStep('success');
    // Redirect to main app after brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setUserEmail('');
  };

  return (
    <div className={`
      min-h-screen relative overflow-hidden transition-colors duration-300
      ${resolvedTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-teal-50 to-slate-100'
      }
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className={`
          absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.3),transparent_50%)]
          ${resolvedTheme === 'dark' ? 'opacity-40' : 'opacity-20'}
        `} />
        <div className={`
          absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.3),transparent_50%)]
          ${resolvedTheme === 'dark' ? 'opacity-40' : 'opacity-20'}
        `} />
      </div>

      {/* Theme & Language Controls */}
      <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} flex gap-3 z-10`}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`
            glass-panel-deep p-8 w-full max-w-md relative
            ${resolvedTheme === 'dark' 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/70 border-white/50'
            }
          `}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`
                text-2xl font-bold mb-2 tracking-wide
                bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent
                ${isRTL ? 'font-arabic' : ''}
              `}
              style={{ textShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
            >
              {t('populationDynamicsSystem', { defaultValue: 'POPULATION DYNAMICS SYSTEM' })}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`
                text-sm 
                ${resolvedTheme === 'dark' 
                  ? 'text-white/70' 
                  : 'text-gray-600'
                }
                ${isRTL ? 'font-arabic' : ''}
              `}
            >
              {currentStep === 'login' && t('welcomeBackSignIn', { defaultValue: 'Welcome back—please sign in to continue' })}
              {currentStep === 'mfa' && t('verifyIdentity', { defaultValue: 'Verify Your Identity' })}
              {currentStep === 'success' && 'Welcome! Redirecting...'}
            </motion.p>
          </div>

          {/* Auth Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm 
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              </motion.div>
            )}

            {currentStep === 'mfa' && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MfaChallenge
                  email={userEmail}
                  onSuccess={handleMfaSuccess}
                  onBack={handleBackToLogin}
                />
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full mx-auto mb-4"
                />
                <p className={`
                  text-lg font-medium 
                  ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}
                `}>
                  Redirecting to dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div className="flex justify-center gap-6 text-xs">
              <a 
                href="#" 
                className={`
                  transition-colors hover:underline
                  ${resolvedTheme === 'dark' 
                    ? 'text-white/50 hover:text-white/70' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {t('privacyPolicy', { defaultValue: 'Privacy Policy' })}
              </a>
              <a 
                href="#" 
                className={`
                  transition-colors hover:underline
                  ${resolvedTheme === 'dark' 
                    ? 'text-white/50 hover:text-white/70' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {t('termsOfService', { defaultValue: 'Terms of Service' })}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;
