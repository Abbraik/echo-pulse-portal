
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const FullscreenOverlay: React.FC<FullscreenOverlayProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  // Enhanced keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={title || "Fullscreen panel"}
          onClick={onClose}
        >
          <div className="h-full p-2 md:p-4" onClick={e => e.stopPropagation()}>
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.95,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: 20
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="h-full bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl"
            >
              {/* Enhanced Close Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white hover:text-teal-200 transition-all duration-200"
                  aria-label="Close fullscreen (Esc)"
                >
                  <X size={16} />
                </Button>
              </motion.div>
              
              {/* Enhanced Content Area */}
              <motion.div 
                className="h-full overflow-auto custom-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {children}
              </motion.div>

              {/* Subtle animated border effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-teal-500/20 pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(20, 184, 166, 0.1)",
                    "0 0 40px rgba(20, 184, 166, 0.2)",
                    "0 0 20px rgba(20, 184, 166, 0.1)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
