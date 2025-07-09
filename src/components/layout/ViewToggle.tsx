import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ViewToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isSecretaryGeneralView = location.pathname === '/sg';
  const isClaimantView = location.pathname === '/claims';
  
  const getCurrentView = () => {
    if (isSecretaryGeneralView) return 'Secretary General';
    if (isClaimantView) return 'Claimant';
    return 'Standard';
  };

  const handleViewSwitch = (view: 'sg' | 'claims' | 'home') => {
    switch (view) {
      case 'sg':
        navigate('/sg');
        break;
      case 'claims':
        navigate('/claims');
        break;
      case 'home':
        navigate('/');
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="glass-button flex items-center gap-2 text-sm"
        >
          {isSecretaryGeneralView ? (
            <Crown className="h-4 w-4 text-yellow-400" />
          ) : isClaimantView ? (
            <User className="h-4 w-4 text-teal-400" />
          ) : (
            <User className="h-4 w-4 text-blue-400" />
          )}
          <span>{getCurrentView()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel">
        <DropdownMenuItem 
          onClick={() => handleViewSwitch('home')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4 text-blue-400" />
          Standard View
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleViewSwitch('claims')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4 text-teal-400" />
          Claimant View
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleViewSwitch('sg')}
          className="flex items-center gap-2"
        >
          <Crown className="h-4 w-4 text-yellow-400" />
          Secretary General View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};