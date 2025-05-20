
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Brain, Activity, BarChart, Lightbulb, BookOpen } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "think", path: "/think", icon: Brain },
  { id: "act", path: "/act", icon: Activity },
  { id: "monitor", path: "/monitor", icon: BarChart },
  { id: "learn", path: "/learn", icon: BookOpen },
  { id: "innovate", path: "/innovate", icon: Lightbulb }
];

const LoopNavigation = () => {
  const { t, isRTL } = useTranslation();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="relative glass-panel px-2 py-2 rounded-full flex justify-center items-center max-w-xl mx-auto">
      <div className="flex space-x-2 items-stretch w-full justify-between">
        {navItems.map(({ id, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          const isHovered = hoveredItem === id;
          
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "relative flex items-center justify-center py-2 px-4 rounded-full transition-all duration-300",
                isActive 
                  ? "text-white" 
                  : "text-foreground hover:text-primary",
                "group"
              )}
              onMouseEnter={() => setHoveredItem(id)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active or hover background */}
              {(isActive || isHovered) && (
                <motion.div
                  layoutId="nav-active"
                  className={cn(
                    "absolute inset-0 rounded-full", 
                    isActive 
                      ? id === "think" 
                        ? "bg-gradient-to-r from-teal-600 to-blue-700" 
                        : "bg-gradient-to-r from-teal-500 to-blue-600" 
                      : "bg-white/10"
                  )}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className="relative flex items-center space-x-2">
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && id === "think" && "text-white"
                )} />
                <span className={cn(
                  "font-medium text-sm hidden md:inline-block",
                  isActive && id === "think" && "font-bold"
                )}>
                  {t(id as "think" | "act" | "monitor" | "learn" | "innovate")}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default LoopNavigation;
