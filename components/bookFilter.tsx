import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  category: string;
  level: string;
}

interface BookFilterProps {
  filters: FilterOption[];
  selectedCategory: string;
  selectedLevel: string;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  onReset: () => void;
}

const BookFilter = ({
  filters,
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
  onReset
}: BookFilterProps) => {
  // Get unique categories and levels
  const categories = Array.from(new Set(filters.map((f) => f.category))).filter(
    Boolean
  );
  const levels = Array.from(new Set(filters.map((f) => f.level))).filter(
    Boolean
  );

  // Helper function to display value or "All"
  const displayValue = (value: string) => value || 'All';

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      {/* Title Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filter Books</h3>
        </div>
        {(selectedCategory || selectedLevel) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-muted-foreground hover:text-primary"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger
              className={cn(
                'w-full',
                !selectedCategory && 'text-muted-foreground'
              )}
            >
              <SelectValue placeholder="All Categories">
                {displayValue(selectedCategory)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Level
          </label>
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger
              className={cn(
                'w-full',
                !selectedLevel && 'text-muted-foreground'
              )}
            >
              <SelectValue placeholder="All Levels">
                {displayValue(selectedLevel)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || selectedLevel) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          {selectedCategory && (
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedLevel && (
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm">
              Level: {selectedLevel}
              <button
                onClick={() => onLevelChange('')}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookFilter;
