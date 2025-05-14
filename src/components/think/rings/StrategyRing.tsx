
import React from 'react';

// Card type for draggable strategy cards
interface StrategyCard {
  id: string;
  title: string;
  position: { x: number; y: number };
}

const StrategyRing: React.FC = () => {
  // Mock strategy cards data
  const strategyCards: StrategyCard[] = [
    { 
      id: "card1", 
      title: "Water Management", 
      position: { x: 30, y: 20 } 
    },
    { 
      id: "card2", 
      title: "Education Reform", 
      position: { x: 70, y: 30 } 
    },
    { 
      id: "card3", 
      title: "Healthcare Access", 
      position: { x: 20, y: 70 } 
    },
    { 
      id: "card4", 
      title: "Energy Transition", 
      position: { x: 75, y: 75 } 
    },
  ];

  return (
    <div className="w-full h-full relative">
      {strategyCards.map(card => (
        <div
          key={card.id}
          className="absolute bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 w-24 cursor-move hover:bg-white/20 transition-colors"
          style={{
            top: `${card.position.y}%`,
            left: `${card.position.x}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <p className="text-xs text-white font-medium truncate">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StrategyRing;
