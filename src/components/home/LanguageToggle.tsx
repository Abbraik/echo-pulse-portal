
import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, isRTL } = useTranslation();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white/5 backdrop-blur-sm border-white/10"
        onClick={toggleLanguage}
      >
        <Globe className="h-4 w-4 mr-2" />
        <span>{language === 'en' ? 'العربية' : 'English'}</span>
      </Button>
    </motion.div>
  );
};

export default LanguageToggle;
