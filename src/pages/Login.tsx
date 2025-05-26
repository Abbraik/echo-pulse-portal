
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { MfaChallenge } from '@/components/auth/MfaChallenge';
import { LanguageToggle } from '@/components/home/LanguageToggle';
import { ThemeToggle } from '@/components/home/ThemeToggle';

export const Login: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMfaChallenge, setShowMfaChallenge] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email: string, requiresMfa: boolean) => {
    setUserEmail(email);
    if (requiresMfa) {
      setShowMfaChallenge(true);
    } else {
      // Redirect to dashboard
      console.log('Login successful, redirecting...');
    }
  };

  const handleMfaSuccess = () => {
    setShowMfaChallenge(false);
    // Redirect to dashboard
    console.log('MFA verified, redirecting...');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with UAE map overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-navy-800 via-teal-700 to-blue-800"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M200,400 Q400,200 600,400 T1000,400" stroke="rgba(20,184,166,0.1)" stroke-width="2" fill="none"/%3E%3Ccircle cx="300" cy="300" r="3" fill="rgba(20,184,166,0.2)"/%3E%3Ccircle cx="700" cy="500" r="3" fill="rgba(20,184,166,0.2)"/%3E%3Ccircle cx="900" cy="200" r="3" fill="rgba(20,184,166,0.2)"/%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Language Toggle - Top Right */}
      <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-20`}>
        <LanguageToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {/* Glass Container */}
          <div className="glass-panel-deep p-8 relative">
            {/* Logo and Branding */}
            <div className="text-center mb-8">
              <motion.h1 
                className="text-2xl font-bold mb-2 hero-heading"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(20, 184, 166, 0.5)',
                    '0 0 20px rgba(20, 184, 166, 0.3)',
                    '0 0 10px rgba(20, 184, 166, 0.5)'
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {t('populationDynamicsSystem', { defaultValue: 'POPULATION DYNAMICS SYSTEM' })}
              </motion.h1>
              <p className="text-sm text-white/70">
                {t('welcomeBackSignIn', { defaultValue: 'Welcome back—please sign in to continue' })}
              </p>
            </div>

            {/* Authentication Forms */}
            {!showMfaChallenge ? (
              <LoginForm 
                onLoginSuccess={handleLoginSuccess}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            ) : (
              <MfaChallenge 
                email={userEmail}
                onSuccess={handleMfaSuccess}
                onBack={() => setShowMfaChallenge(false)}
              />
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-center space-x-4 rtl:space-x-reverse text-xs text-white/60">
                <a href="#" className="hover:text-teal-400 transition-colors">
                  {t('privacyPolicy', { defaultValue: 'Privacy Policy' })}
                </a>
                <span>•</span>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  {t('termsOfService', { defaultValue: 'Terms of Service' })}
                </a>
              </div>
            </div>
          </div>

          {/* Theme Toggle - Bottom Left */}
          <div className={`absolute bottom-6 ${isRTL ? 'right-6' : 'left-6'}`}>
            <ThemeToggle />
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
