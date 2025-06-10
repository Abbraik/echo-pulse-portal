
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  id: string;
  name: string;
  level: number;
}

interface BreadcrumbNavProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (level: number) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  breadcrumbs,
  onNavigate
}) => {
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Treemap navigation">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Button
            onClick={() => onNavigate(0)}
            variant="ghost"
            size="sm"
            className="breadcrumb-button"
            aria-label="Go to root"
          >
            <Home className="w-4 h-4" />
            Root
          </Button>
        </li>
        
        {breadcrumbs.slice(1).map((item, index) => (
          <li key={item.id} className="breadcrumb-item">
            <ChevronRight className="breadcrumb-separator" />
            <Button
              onClick={() => onNavigate(item.level)}
              variant="ghost"
              size="sm"
              className="breadcrumb-button"
              aria-current={index === breadcrumbs.length - 2 ? 'page' : undefined}
            >
              {item.name}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
};
