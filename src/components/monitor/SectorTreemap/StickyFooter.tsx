
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, HelpCircle, Accessibility } from 'lucide-react';

interface StickyFooterProps {
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  hasChanges,
  onSave,
  onCancel
}) => {
  return (
    <footer className="sticky-footer" role="contentinfo">
      <div className="footer-content">
        {/* Action Buttons */}
        <div className="footer-actions">
          {hasChanges && (
            <>
              <Button
                onClick={onSave}
                className="glass-button save-button"
                aria-label="Save all changes"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="glass-button-outline"
                aria-label="Cancel all changes"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <a
            href="/help"
            className="footer-link"
            aria-label="Help and documentation"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & Documentation
          </a>
          <a
            href="/accessibility"
            className="footer-link"
            aria-label="Accessibility information"
          >
            <Accessibility className="w-4 h-4 mr-2" />
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
};
