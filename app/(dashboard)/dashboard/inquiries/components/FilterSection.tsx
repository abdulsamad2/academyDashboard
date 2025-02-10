// components/FilterSection.tsx
import { Button } from '@/components/ui/button';
import { Filters } from '../components/types';

interface FilterSectionProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  uniqueLevels: string[];
  uniqueModes: string[];
  uniqueSubjects: string[];
}

export function FilterSection({
  filters,
  setFilters,
  uniqueLevels,
  uniqueModes,
  uniqueSubjects
}: FilterSectionProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilters({ studentLevel: '', mode: '', subject: '' })}
      >
        Clear Filters
      </Button>
      <select
        className="rounded-md border p-2"
        value={filters.studentLevel}
        onChange={(e) =>
          setFilters({ ...filters, studentLevel: e.target.value })
        }
      >
        <option value="">All Levels</option>
        {uniqueLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <select
        className="rounded-md border p-2"
        value={filters.mode}
        onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
      >
        <option value="">All Modes</option>
        {uniqueModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
      <select
        className="rounded-md border p-2"
        value={filters.subject}
        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
      >
        <option value="">All Subjects</option>
        {uniqueSubjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
    </div>
  );
}
