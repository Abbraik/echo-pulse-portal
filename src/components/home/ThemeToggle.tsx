
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
        className={
          resolvedTheme === 'dark' 
            ? "bg-white/5 backdrop-blur-sm border-white/10" 
            : "bg-white/50 backdrop-blur-sm border-gray-400/30 text-gray-800 hover:bg-white/60" /* Improved contrast for light mode */
        }
        onClick={toggleTheme}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-4 w-4 mr-2" />
        ) : (
          <Moon className="h-4 w-4 mr-2 text-gray-700" /* Darker color for better contrast */ />
        )}
        <span className={resolvedTheme === 'dark' ? '' : 'text-gray-800'}>
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
