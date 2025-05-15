
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white/5 backdrop-blur-sm border-white/10"
        onClick={toggleTheme}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-4 w-4 mr-2" />
        ) : (
          <Moon className="h-4 w-4 mr-2" />
        )}
        <span>{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
