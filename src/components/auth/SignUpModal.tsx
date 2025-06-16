
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccess: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ 
  isOpen, 
  onClose, 
  onSignUpSuccess 
}) => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { error: signUpError } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        role: 'analyst'
      });
      
      if (signUpError) {
        setError(signUpError.message);
      } else {
        onSignUpSuccess();
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md"
      >
        {/* Glass Container */}
        <div className="relative backdrop-blur-3xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Neon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
          
          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/60 hover:text-white/80 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white mb-2 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  textShadow: '0 0 20px rgba(20, 184, 166, 0.5)',
                  filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.3))'
                }}
              >
                {t('createAccount', { defaultValue: 'CREATE ACCOUNT' })}
              </motion.h2>
              <motion.p 
                className="text-white/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('joinPopulationSystem', { defaultValue: 'Join the Population Dynamics System' })}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* First Name Field */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-white/80">
                  {t('firstName', { defaultValue: 'First Name' })}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
                    placeholder={t('enterFirstName', { defaultValue: 'Enter your first name' })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-white/80">
                  {t('lastName', { defaultValue: 'Last Name' })}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
                    placeholder={t('enterLastName', { defaultValue: 'Enter your last name' })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="signupEmail" className="text-sm font-medium text-white/80">
                  {t('email', { defaultValue: 'Email' })}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
                    placeholder={t('enterEmail', { defaultValue: 'Enter your email' })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="signupPassword" className="text-sm font-medium text-white/80">
                  {t('password', { defaultValue: 'Password' })}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <Input
                    id="signupPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-teal-400 focus:ring-teal-400/20"
                    placeholder={t('enterPassword', { defaultValue: 'Enter your password' })}
                    disabled={isLoading}
                    required
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

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password || !firstName || !lastName}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t('createAccount', { defaultValue: 'Create Account' })}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
