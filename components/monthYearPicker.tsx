'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameMonth } from 'date-fns';

interface MonthYearPickerProps {
  studentId?: string;
  initialMonth?: number;
  initialYear?: number;
}

export function MonthYearPicker({
  studentId,
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
}: MonthYearPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get month/year from URL or use defaults
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    new Date(initialYear, initialMonth, 1)
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Update state when URL params change
  useEffect(() => {
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('year');

    if (monthParam && !isNaN(parseInt(monthParam))) {
      setSelectedMonth(parseInt(monthParam));
    }

    if (yearParam && !isNaN(parseInt(yearParam))) {
      setSelectedYear(parseInt(yearParam));
    }

    // Update calendar date when month/year change
    setCalendarDate(
      new Date(
        yearParam ? parseInt(yearParam) : selectedYear,
        monthParam ? parseInt(monthParam) : selectedMonth,
        1
      )
    );
  }, [searchParams, selectedMonth, selectedYear]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    updateUrlAndState(newMonth, newYear);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    updateUrlAndState(newMonth, newYear);
  };

  // Navigate to current month
  const goToCurrentMonth = () => {
    const today = new Date();
    updateUrlAndState(today.getMonth(), today.getFullYear());
  };

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const newMonth = date.getMonth();
      const newYear = date.getFullYear();
      updateUrlAndState(newMonth, newYear);
      setCalendarDate(date);
      setIsCalendarOpen(false);
    }
  };

  // Update URL and component state
  const updateUrlAndState = (month: number, year: number) => {
    // Create new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams.toString());

    // Update month and year params
    params.set('month', month.toString());
    params.set('year', year.toString());

    // Keep student ID if it exists
    if (studentId) {
      params.set('id', studentId);
    }

    // Update state
    setSelectedMonth(month);
    setSelectedYear(year);

    // Navigate to new URL with updated params
    router.push(`?${params.toString()}`);
  };

  // Format the current month and year for display
  const currentMonthYear = format(
    new Date(selectedYear, selectedMonth, 1),
    'MMMM yyyy'
  );

  // Check if current selection is the current month
  const isCurrentMonth = isSameMonth(
    new Date(selectedYear, selectedMonth, 1),
    new Date()
  );

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              aria-label="Previous Month"
              className="h-8 w-8 rounded-full border-gray-200 transition-all hover:bg-blue-50 hover:text-blue-600 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto min-w-[220px] justify-start border-gray-200 bg-white px-3 py-2 text-left font-medium hover:bg-blue-50 hover:text-blue-600"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                    <span>{currentMonthYear}</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={handleCalendarSelect}
                  initialFocus
                  defaultMonth={calendarDate}
                  showOutsideDays={false}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }
                  }}
                  fromDate={new Date(2020, 0, 1)}
                  toDate={new Date(2030, 11, 31)}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              aria-label="Next Month"
              className="h-8 w-8 rounded-full border-gray-200 transition-all hover:bg-blue-50 hover:text-blue-600 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentMonth}
              disabled={isCurrentMonth}
              className={`text-xs ${
                isCurrentMonth
                  ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                  : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Current Month
            </Button>
            
            <div className="rounded-md bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
              <span>Data for {currentMonthYear}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthYearPicker;
