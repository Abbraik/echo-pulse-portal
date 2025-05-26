
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';

interface MfaChallengeProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const MfaChallenge: React.FC<MfaChallengeProps> = ({ 
  email, 
  onSuccess, 
  onBack 
}) => {
  const { t, isRTL } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Start resend timer
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last character
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && value) {
      handleSubmit(newCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (submitCode = code) => {
    const codeString = submitCode.join('');
    if (codeString.length !== 6) {
      setError(t('enterSixDigitCode', { defaultValue: 'Please enter all 6 digits' }));
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate MFA verification
    setTimeout(() => {
      setIsLoading(false);
      if (codeString === '123456') { // Mock successful code
        onSuccess();
      } else {
        setError(t('invalidCode', { defaultValue: 'Invalid code. Please try again.' }));
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    // Simulate resend
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <button
          onClick={onBack}
          className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} p-2 text-white/60 hover:text-white transition-colors`}
          aria-label={t('goBack', { defaultValue: 'Go back' })}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-2">
          {t('verifyIdentity', { defaultValue: 'Verify Your Identity' })}
        </h2>
        <p className="text-sm text-white/70">
          {t('enterSixDigitCodeSent', { defaultValue: 'Enter the 6-digit code sent to' })}
        </p>
        <p className="text-sm text-teal-400 font-medium">{email}</p>
      </div>

      {/* Code Input Grid */}
      <div className="space-y-4">
        <div className={`flex justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-12 h-12 text-center text-xl font-bold rounded-lg border-2 
                bg-white/10 text-white placeholder:text-white/30
                border-teal-500/30 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20
                transition-colors outline-none
                ${error ? 'border-red-400' : ''}
              `}
              aria-label={`${t('digit', { defaultValue: 'Digit' })} ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={() => handleSubmit()}
        disabled={isLoading || code.some(digit => !digit)}
        className="w-full h-12 btn-primary-glow text-white font-semibold"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          t('verify', { defaultValue: 'Verify' })
        )}
      </Button>

      {/* Resend Code */}
      <div className="text-center">
        <button
          onClick={handleResendCode}
          disabled={resendTimer > 0}
          className={`
            text-sm transition-colors inline-flex items-center gap-2
            ${resendTimer > 0 
              ? 'text-white/40 cursor-not-allowed' 
              : 'text-teal-400 hover:text-teal-300'
            }
          `}
        >
          <RotateCcw className="h-4 w-4" />
          {resendTimer > 0 
            ? t('resendCodeIn', { defaultValue: 'Resend code in {{seconds}}s', seconds: resendTimer })
            : t('resendCode', { defaultValue: 'Resend code' })
          }
        </button>
      </div>
    </motion.div>
  );
};
