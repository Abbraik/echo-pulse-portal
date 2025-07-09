import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClaimFilter } from '@/types/claims';

interface SearchFilterBarProps {
  filter: ClaimFilter;
  onChange: (filter: Partial<ClaimFilter>) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ filter, onChange }) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search claims..."
          value={filter.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-10 glass-input"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Select value={filter.zone || ''} onValueChange={(value) => onChange({ zone: value || undefined })}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Zones</SelectItem>
            <SelectItem value="THINK">Think</SelectItem>
            <SelectItem value="ACT">Act</SelectItem>
            <SelectItem value="MONITOR">Monitor</SelectItem>
            <SelectItem value="LEARN">Learn</SelectItem>
            <SelectItem value="INNOVATE">Innovate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filter.status || ''} onValueChange={(value) => onChange({ status: value || undefined })}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filter.originZone || ''} onValueChange={(value) => onChange({ originZone: value || undefined })}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Origin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Origins</SelectItem>
            <SelectItem value="THINK">Think</SelectItem>
            <SelectItem value="ACT">Act</SelectItem>
            <SelectItem value="MONITOR">Monitor</SelectItem>
            <SelectItem value="LEARN">Learn</SelectItem>
            <SelectItem value="INNOVATE">Innovate</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};