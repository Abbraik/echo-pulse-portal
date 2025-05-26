
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { t, isRTL } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('emailRequired', { defaultValue: 'Email is required' }));
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t('invalidEmailFormat', { defaultValue: 'Invalid email format' }));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-panel-deep p-6 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-white/60 hover:text-white transition-colors`}
                aria-label={t('close', { defaultValue: 'Close' })}
              >
                <X className="h-5 w-5" />
              </button>

              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {t('resetPassword', { defaultValue: 'Reset Password' })}
                    </h2>
                    <p className="text-sm text-white/70">
                      {t('enterEmailToReset', { defaultValue: 'Enter your email address and we\'ll send you a link to reset your password.' })}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-teal-400`} />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          placeholder={t('emailAddress', { defaultValue: 'Email address' })}
                          className={`
                            ${isRTL ? 'pr-10 text-right' : 'pl-10'} 
                            bg-white/10 border-teal-500/30 text-white placeholder:text-white/50
                            focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20
                            ${error ? 'border-red-400' : ''}
                          `}
                          aria-label={t('emailAddress', { defaultValue: 'Email address' })}
                          aria-invalid={!!error}
                        />
                      </div>
                      {error && (
                        <p className="text-red-400 text-sm" role="alert">
                          {error}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 btn-primary-glow text-white font-semibold"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        t('sendResetLink', { defaultValue: 'Send Reset Link' })
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center">
                    <div className="mb-4">
                      <CheckCircle className="h-16 w-16 text-teal-400 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      {t('emailSent', { defaultValue: 'Email Sent!' })}
                    </h2>
                    <p className="text-sm text-white/70 mb-6">
                      {t('checkEmailForReset', { defaultValue: 'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.' })}
                    </p>
                    <Button
                      onClick={handleClose}
                      className="btn-secondary-glow"
                    >
                      {t('backToLogin', { defaultValue: 'Back to Login' })}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
