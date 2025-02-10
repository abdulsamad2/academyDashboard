// components/SearchBar.tsx
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto mb-8 max-w-md">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
      <Input
        type="search"
        placeholder="Search by name or subject"
        className="w-full rounded-full border-gray-300 py-2 pl-10 pr-4 transition duration-150 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}