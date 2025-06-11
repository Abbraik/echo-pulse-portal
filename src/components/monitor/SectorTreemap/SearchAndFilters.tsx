
import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSectors: string[];
  onSectorChange: (sectors: string[]) => void;
  onReset: () => void;
  availableSectors: string[];
  isCompact?: boolean;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedSectors,
  onSectorChange,
  onReset,
  availableSectors,
  isCompact = false
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [inputError, setInputError] = useState('');
  const [showFilters, setShowFilters] = useState(!isCompact);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery, onSearchChange]);

  const handleSearchInput = (value: string) => {
    // Validate input length
    if (value.length > 100) {
      setInputError('Search query too long (max 100 characters)');
      return;
    }
    setInputError('');
    setDebouncedQuery(value);
  };

  const handleSectorToggle = (sector: string) => {
    const newSelection = selectedSectors.includes(sector)
      ? selectedSectors.filter(s => s !== sector)
      : [...selectedSectors, sector];
    onSectorChange(newSelection);
  };

  const handleReset = () => {
    setDebouncedQuery('');
    setInputError('');
    onReset();
  };

  return (
    <div className={`search-filters-panel ${isCompact ? 'compact' : ''}`}>
      {/* Search Input */}
      <div className="search-container">
        <label htmlFor="indicator-search" className="sr-only">
          Search indicators
        </label>
        <div className="relative">
          <Search className="search-icon" />
          <input
            id="indicator-search"
            type="text"
            placeholder="Search indicators..."
            value={debouncedQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="search-input"
            aria-describedby={inputError ? 'search-error' : undefined}
            aria-invalid={!!inputError}
          />
          {debouncedQuery && (
            <button
              onClick={() => handleSearchInput('')}
              className="clear-search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {inputError && (
          <p id="search-error" className="input-error" role="alert">
            {inputError}
          </p>
        )}
      </div>

      {/* Filter Toggle for Compact Mode */}
      {isCompact && (
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
          aria-expanded={showFilters}
          aria-controls="sector-filters"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      )}

      {/* Sector Filters */}
      <motion.div
        id="sector-filters"
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="sector-filters"
        role="group"
        aria-labelledby="sector-filter-label"
      >
        <label id="sector-filter-label" className="filter-label">
          Filter by Sectors
        </label>
        <div className="sector-pills">
          {availableSectors.map((sector) => (
            <button
              key={sector}
              onClick={() => handleSectorToggle(sector)}
              className={`sector-pill ${selectedSectors.includes(sector) ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={selectedSectors.includes(sector)}
              aria-label={`${selectedSectors.includes(sector) ? 'Remove' : 'Add'} ${sector} filter`}
            >
              {sector}
              {selectedSectors.includes(sector) && (
                <X className="w-3 h-3 ml-2" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reset Button */}
      {(debouncedQuery || selectedSectors.length > 0) && (
        <Button
          onClick={handleReset}
          className="reset-button"
          aria-label="Reset all filters"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
