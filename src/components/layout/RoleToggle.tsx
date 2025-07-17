import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type UserRole = 'Champion' | 'Analyst' | 'Custodian' | 'Juror';

interface RoleToggleProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({ currentRole, onRoleChange }) => {
  const roles: UserRole[] = ['Champion', 'Analyst', 'Custodian', 'Juror'];

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Champion': return 'text-emerald-400';
      case 'Analyst': return 'text-blue-400';
      case 'Custodian': return 'text-yellow-400';
      case 'Juror': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-sm bg-white/5 backdrop-blur-sm border border-white/10 
                     hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          aria-label="Change role"
        >
          <User size={14} className={getRoleColor(currentRole)} />
          <span className="text-muted-foreground">{currentRole}</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-panel-dark min-w-[120px]" align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => onRoleChange(role)}
            className={`cursor-pointer flex items-center space-x-2 px-3 py-2 text-sm
                       hover:bg-white/10 transition-colors ${
                         currentRole === role ? 'bg-white/5' : ''
                       }`}
          >
            <User size={14} className={getRoleColor(role)} />
            <span className={currentRole === role ? getRoleColor(role) : 'text-muted-foreground'}>
              {role}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};