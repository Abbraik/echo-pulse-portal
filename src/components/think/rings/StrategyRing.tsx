
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

// Card type for draggable strategy cards
interface StrategyCard {
  id: string;
  title: string;
  position: { x: number; y: number };
  priority: 'high' | 'medium' | 'low';
  leveragePoint?: number;
}

interface StrategyRingProps {
  objectives: StrategyCard[];
  onFocus: () => void;
}

const StrategyRing: React.FC<StrategyRingProps> = ({ objectives, onFocus }) => {
  const [cards, setCards] = useState<StrategyCard[]>(objectives);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  
  const handleCardSelect = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(prev => prev.filter(id => id !== cardId));
    } else {
      setSelectedCards(prev => [...prev, cardId]);
      onFocus();
    }
  };
  
  const handleExportToAct = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "No cards selected",
        description: "Select one or more strategy cards to export.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Strategies Exported to ACT",
      description: `${selectedCards.length} strategies have been exported to the ACT zone.`,
      variant: "default",
    });
    
    // Reset selection
    setSelectedCards([]);
  };
  
  // Mock strategy cards data
  const strategyCards: StrategyCard[] = [
    { 
      id: "card1", 
      title: "Water Management", 
      position: { x: 30, y: 20 },
      priority: 'high',
      leveragePoint: 1
    },
    { 
      id: "card2", 
      title: "Education Reform", 
      position: { x: 70, y: 30 },
      priority: 'medium',
      leveragePoint: 3
    },
    { 
      id: "card3", 
      title: "Healthcare Access", 
      position: { x: 20, y: 70 },
      priority: 'high',
      leveragePoint: 2
    },
    { 
      id: "card4", 
      title: "Energy Transition", 
      position: { x: 75, y: 75 },
      priority: 'low',
      leveragePoint: 6
    },
    { 
      id: "card5", 
      title: "Migration Policy", 
      position: { x: 50, y: 15 },
      priority: 'medium',
      leveragePoint: 4
    },
    { 
      id: "card6", 
      title: "Urban Planning", 
      position: { x: 15, y: 40 },
      priority: 'low',
      leveragePoint: 7
    },
    { 
      id: "card7", 
      title: "Food Security", 
      position: { x: 85, y: 50 },
      priority: 'high',
      leveragePoint: 2
    },
    { 
      id: "card8", 
      title: "Housing Policy", 
      position: { x: 40, y: 85 },
      priority: 'medium',
      leveragePoint: 5
    },
  ];

  return (
    <div className="w-full h-full relative">
      {/* Export to ACT orb */}
      <motion.div 
        className={`absolute top-[5%] left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full 
          flex items-center justify-center backdrop-blur-sm cursor-pointer z-10
          ${selectedCards.length > 0 ? 'bg-teal-500/70 hover:bg-teal-500/90' : 'bg-white/10 hover:bg-white/20'}`}
        onClick={handleExportToAct}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: selectedCards.length > 0 
            ? ['0 0 0 rgba(20,184,166,0)', '0 0 15px rgba(20,184,166,0.7)', '0 0 0 rgba(20,184,166,0)'] 
            : '0 0 0 rgba(20,184,166,0)',
        }}
        transition={{
          duration: 2,
          repeat: selectedCards.length > 0 ? Infinity : 0,
        }}
      >
        <Send size={18} className="text-white" />
        {selectedCards.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {selectedCards.length}
          </div>
        )}
      </motion.div>

      {strategyCards.map(card => (
        <motion.div
          key={card.id}
          className={`absolute backdrop-blur-sm rounded-lg p-2 w-24 cursor-move hover:bg-white/20 transition-colors
            ${selectedCards.includes(card.id) ? 'bg-teal-500/30 border border-teal-500/70' : 'bg-white/10 border border-white/20'}
            ${card.priority === 'high' ? 'ring-2 ring-teal-500/30' : 
              card.priority === 'medium' ? 'ring-1 ring-teal-500/20' : ''}`}
          style={{
            top: `${card.position.y}%`,
            left: `${card.position.x}%`,
            transform: 'translate(-50%, -50%)'
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleCardSelect(card.id)}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-white font-medium truncate">{card.title}</p>
            {card.leveragePoint && (
              <div className="bg-white/20 text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {card.leveragePoint}
              </div>
            )}
          </div>
          <div className={`h-1 rounded-full 
            ${card.priority === 'high' ? 'bg-teal-500' : 
              card.priority === 'medium' ? 'bg-blue-500' : 
              'bg-gray-500'}`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default StrategyRing;
