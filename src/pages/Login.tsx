
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import ParticlesBackground from '@/components/ui/particles-background';
import { LoginForm } from '@/components/auth/LoginForm';
import { MfaChallenge } from '@/components/auth/MfaChallenge';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import LanguageToggle from '@/components/home/LanguageToggle';
import ThemeToggle from '@/components/home/ThemeToggle';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'login' | 'mfa' | 'forgot'>('login');
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email: string, requiresMfa: boolean) => {
    setUserEmail(email);
    if (requiresMfa) {
      setCurrentStep('mfa');
    } else {
      onLoginSuccess();
    }
  };

  const handleMfaSuccess = () => {
    onLoginSuccess();
  };

  const handleForgotPassword = () => {
    setCurrentStep('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
        <ParticlesBackground count={50} colorStart="#14B8A680" colorEnd="#2563EB80" />
        {/* UAE Map Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTRCOEE2IiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-20">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Glass Container */}
          <div className="relative backdrop-blur-3xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Neon Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-2xl font-bold text-white mb-2 tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    textShadow: '0 0 20px rgba(20, 184, 166, 0.5)',
                    filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.3))'
                  }}
                >
                  {t('populationDynamicsSystem', { defaultValue: 'POPULATION DYNAMICS SYSTEM' })}
                </motion.h1>
                <motion.p 
                  className="text-white/70 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentStep === 'login' && t('welcomeBackSignIn', { defaultValue: 'Welcome back—please sign in to continue' })}
                  {currentStep === 'mfa' && t('verifyIdentity', { defaultValue: 'Verify Your Identity' })}
                  {currentStep === 'forgot' && t('resetPassword', { defaultValue: 'Reset Password' })}
                </motion.p>
              </div>

              {/* Form Content */}
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
                      onForgotPassword={handleForgotPassword}
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

                {currentStep === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ForgotPasswordModal
                      isOpen={true}
                      onClose={handleBackToLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Links */}
          <motion.div 
            className="text-center mt-6 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center space-x-6 text-xs text-white/50">
              <a href="#" className="hover:text-white/80 transition-colors">
                {t('privacyPolicy', { defaultValue: 'Privacy Policy' })}
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                {t('termsOfService', { defaultValue: 'Terms of Service' })}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
