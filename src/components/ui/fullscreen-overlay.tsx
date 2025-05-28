
import React from 'react';
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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={title || "Fullscreen panel"}
        >
          <div className="h-full p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="h-full bg-background/95 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl overflow-hidden relative"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-white/10 hover:bg-white/20"
                aria-label="Close fullscreen"
              >
                <X size={16} />
              </Button>
              
              <div className="h-full overflow-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
