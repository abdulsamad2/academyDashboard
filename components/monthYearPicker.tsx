'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

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
  }, [searchParams]);

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

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const newMonth = date.getMonth();
      const newYear = date.getFullYear();
      updateUrlAndState(newMonth, newYear);
      setCalendarDate(date);
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

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentMonthYear}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleCalendarSelect}
                initialFocus
                // Show only month and year
                defaultMonth={calendarDate}
                showOutsideDays={false}
                // Custom date render function to highlight current month
                modifiersStyles={{
                  selected: {
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }
                }}
                // Formatting to show only the necessary date (day 1 is enough for month selection)
                fromDate={new Date(2020, 0, 1)} // Limit to sensible date range
                toDate={new Date(2030, 11, 31)} // Limit to sensible date range
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Showing data for {currentMonthYear}
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthYearPicker;
