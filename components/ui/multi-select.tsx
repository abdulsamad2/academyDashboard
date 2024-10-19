import React, { useState, useCallback } from 'react';
import { useController, Control } from 'react-hook-form';

interface MultiSelectFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  loading?: boolean;
}

const MultiSelectFormField: React.FC<MultiSelectFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  options,
  loading = false,
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: [], // Default to an empty array to prevent undefined
  });

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure the value is always an array
  const value = Array.isArray(field.value) ? field.value : [];

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = useCallback(
    (option: { value: string; label: string }) => {
      const newValue = value.includes(option.value)
        ? value.filter((val) => val !== option.value)
        : [...value, option.value];
      field.onChange(newValue);
    },
    [value, field]
  );

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-left focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
            value.length === 0 ? 'text-gray-400' : ''
          }`}
          onClick={() => setOpen(!open)}
          disabled={loading}
        >
          {value.length > 0 ? `${value.length} selected` : placeholder}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.993.883L11 4v12a1 1 0 01-1.993.117L9 16V4a1 1 0 011-1zm4.707 5.707a1 1 0 01-1.414 0L10 5.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      value.includes(option.value) ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      readOnly
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No {label.toLowerCase()} found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectFormField;
