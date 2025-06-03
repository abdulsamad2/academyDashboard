// app/(dashboard)/dashboard/tutor-report/page.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { getTutorMonthlyReport, TutorReportData, TutorReportSummary, getAllActiveTutorsServerAction, StudentReportEntry } from '@/action/reportActions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Users, BarChart, User, ChevronUp, ChevronDown } from 'lucide-react';

// Define a specific type for the tutor data needed by the page
type BasicTutorInfo = { id: string; name: string | null; email: string | null; };

// Type for combined tutor report data for the table rows
type TutorReportRowData = BasicTutorInfo & {
  summary: TutorReportSummary | null;
  students: StudentReportEntry[];
  error?: string;
  isLoading: boolean;
  isExpanded?: boolean; // Track expansion state
};

const ITEMS_PER_PAGE = 10;

// Helper to get current year and month for defaults
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth(); // JavaScript months are 0-indexed

const yearOptions = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);
const monthOptions = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

function getPreviousMonthPeriod(year: number, month: number) {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

function getNextMonthPeriod(year: number, month: number) {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}


export default function AllTutorsReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [allTutors, setAllTutors] = useState<BasicTutorInfo[]>([]);
  const [reportData, setReportData] = useState<TutorReportRowData[]>([]);
  const [isLoadingTutors, setIsLoadingTutors] = useState(true);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const page = searchParams.get('page');

  const displayYear = year ? parseInt(year) : getCurrentYear();
  const displayMonth = month ? parseInt(month) : getCurrentMonth();
  const currentPage = page ? parseInt(page) : 1;

  useEffect(() => {
    async function fetchTutors() {
      setIsLoadingTutors(true);
      try {
        const tutors = await getAllActiveTutorsServerAction();
        setAllTutors(tutors);
      } catch (err) {
        setAllTutors([]);
      }
      setIsLoadingTutors(false);
    }
    fetchTutors();
  }, []);

  useEffect(() => {
    if (isLoadingTutors) return; // Don't fetch reports if tutors are still loading

    if (allTutors.length > 0) {
      setIsLoadingReports(true);
      setReportData(allTutors.map(t => ({ ...t, summary: null, students: [], isLoading: true, error: undefined })));

      const fetchAllReports = async () => {
        const reportPromises = allTutors.map(tutor =>
          getTutorMonthlyReport({ tutorId: tutor.id, year: displayYear, month: displayMonth })
            .then((data: TutorReportData) => ({ 
              ...tutor, 
              summary: data.summary, 
              students: data.studentsReport || [], 
              error: data.error, 
              isLoading: false,
              isExpanded: false, // Start with collapsed view
              hasStudents: (data.studentsReport || []).length > 0 // Flag to check if tutor has assigned students
            }))
            .catch((err: any) => ({ 
              ...tutor, 
              summary: null, 
              students: [],
              error: err.message || "Failed to fetch report", 
              isLoading: false,
              isExpanded: false,
              hasStudents: false
            }))
        );
        
        const results = await Promise.all(reportPromises);
        
        // Filter to only include tutors with assigned students
        const tutorsWithStudents = results.filter(tutor => tutor.hasStudents);
        
        setReportData(tutorsWithStudents);
        setIsLoadingReports(false);
      };
      fetchAllReports();
    } else {
      setReportData([]); // Clear report data if no tutors
      setIsLoadingReports(false);
    }
  }, [allTutors, displayYear, displayMonth, isLoadingTutors]);

  const handleDateChange = (type: 'year' | 'month', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Function to toggle student details visibility for a tutor
  const toggleTutorDetails = (tutorId: string) => {
    setReportData(prev => prev.map(tutor => 
      tutor.id === tutorId 
        ? { ...tutor, isExpanded: !tutor.isExpanded } 
        : tutor
    ));
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return reportData.slice(startIndex, endIndex);
  }, [reportData, currentPage]);

  const totalPages = Math.ceil(reportData.length / ITEMS_PER_PAGE);
  const prevMonthData = getPreviousMonthPeriod(displayYear, displayMonth);
  const nextMonthData = getNextMonthPeriod(displayYear, displayMonth);

  const navigateToMonth = (targetYear: number, targetMonth: number) => {
    const params = new URLSearchParams();
    params.set('year', targetYear.toString());
    params.set('month', targetMonth.toString());
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  // Initial page loading skeleton
  if (isLoadingTutors && allTutors.length === 0) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-1/3 mb-2" /> {/* Title Skeleton */}
        <Card className="mb-6">
          <CardContent className="p-4 flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </CardContent>
        </Card>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader><Skeleton className="h-7 w-1/4" /></CardHeader>
          <CardContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2 border-b">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/8" />
                <Skeleton className="h-5 w-1/8" />
                <Skeleton className="h-5 w-1/8" />
                <Skeleton className="h-5 w-1/8" />
                <Skeleton className="h-5 w-1/8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Modern Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-md p-8 mb-8 border border-blue-100/50 dark:border-blue-800/30">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6 px-2">
            Tutor Monthly Performance Report
          </h1>
          
          {/* Month Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 border border-blue-100 dark:border-blue-800/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
              onClick={() => navigateToMonth(prevMonthData.year, prevMonthData.month)}
            >
              <ChevronLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 truncate">{monthOptions.find(m => m.value === prevMonthData.month)?.label} {prevMonthData.year}</span>
            </Button>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent px-4 py-2 rounded-lg order-first sm:order-none">
              {monthOptions.find(m => m.value === displayMonth)?.label} {displayYear}
            </h2>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 border border-indigo-100 dark:border-indigo-800/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-end"
              onClick={() => navigateToMonth(nextMonthData.year, nextMonthData.month)}
            >
              <span className="text-slate-700 dark:text-slate-300 truncate">{monthOptions.find(m => m.value === nextMonthData.month)?.label} {nextMonthData.year}</span>
              <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </Button>
          </div>
          
          {/* Date Selectors */}
          <div className="flex justify-center sm:justify-end items-center mt-4">
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center bg-white/70 dark:bg-slate-900/50 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <label htmlFor="year-select" className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[40px]">
                  Year
                </label>
                <Select
                  value={displayYear.toString()}
                  onValueChange={(value) => handleDateChange('year', value)}
                >
                  <SelectTrigger className="w-[110px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <label htmlFor="month-select" className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[40px]">
                  Month
                </label>
                <Select
                  value={displayMonth.toString()}
                  onValueChange={(value) => handleDateChange('month', value)}
                >
                  <SelectTrigger className="w-[130px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tutor List Section */}
        <div className="flex items-center gap-3 mb-6 py-2 border-b border-slate-200 dark:border-slate-700/50">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-full shadow-sm">
            <span className="flex items-center justify-center h-6 w-6 text-indigo-600 dark:text-indigo-400 text-base font-bold">👩‍🏫</span>
          </div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Active Tutors</h2>
        </div>
        
        {/* Loading State */}
        {(isLoadingReports && paginatedData.length === 0 && allTutors.length > 0) && 
          Array.from({ length: Math.min(ITEMS_PER_PAGE, allTutors.length) }).map((_, i) => (
            <Card key={`skeleton-card-${i}`} className="mb-6 border border-slate-200/70 dark:border-slate-700/50 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/70 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-2">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))
        }
        
        {/* No Data State */}
        {!isLoadingTutors && !isLoadingReports && paginatedData.length === 0 && (
          <Card className="mb-4 overflow-hidden border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-800/80">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center gap-4">
              <div className="bg-slate-100/80 dark:bg-slate-800/50 p-4 rounded-full">
                <span className="flex items-center justify-center h-12 w-12 text-slate-500 dark:text-slate-400 text-2xl">
                  {allTutors.length === 0 ? '👩‍🏫' : '📊'}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                  {allTutors.length === 0 ? 'No Active Tutors Found' : 'No Report Data Available'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {allTutors.length === 0 
                    ? "There are no active tutors in the system or the data could not be retrieved. Please ensure tutors are assigned to students." 
                    : "There's no performance data available for the selected period. Try selecting a different month or year."}
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  onClick={() => {
                    const currentDate = new Date();
                    navigateToMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
                  }}
                >
                  View Current Month
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tutor Cards with Student Details */}
        {paginatedData.map((tutor) => (
          <Card 
            key={tutor.id} 
            className="mb-6 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl"
          >
            {/* Tutor Header */}
            <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">{tutor.name || 'N/A'}</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tutor.email || 'N/A'}</p>
                </div>
              </div>
              {!tutor.isLoading && !tutor.error && tutor.summary && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleTutorDetails(tutor.id)}
                  className="rounded-full px-4 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-600 transition-all duration-200 transform hover:scale-105"
                >
                  {tutor.isExpanded ? (
                    <span className="flex items-center gap-1">Hide Students <ChevronUp className="h-4 w-4" /></span>
                  ) : (
                    <span className="flex items-center gap-1">Show Students <ChevronDown className="h-4 w-4" /></span>
                  )}
                </Button>
              )}
            </CardHeader>
            
            {/* Tutor Summary Stats */}
            <CardContent>
              {tutor.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : tutor.error || !tutor.summary ? (
                <div className="p-4 text-center text-red-500">
                  {tutor.error || "Failed to load tutor report"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-2">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Planned Classes</div>
                      <div className="bg-blue-200/50 dark:bg-blue-700/30 p-1 rounded-full">
                        <span className="flex items-center justify-center h-4 w-4 text-blue-600 dark:text-blue-400 text-xs font-bold">📅</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{tutor.summary.totalPlannedClasses}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl shadow-sm border border-green-100 dark:border-green-800/50 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Actual Classes</div>
                      <div className="bg-green-200/50 dark:bg-green-700/30 p-1 rounded-full">
                        <span className="flex items-center justify-center h-4 w-4 text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{tutor.summary.totalActualClasses}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/50 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Missed Classes</div>
                      <div className="bg-amber-200/50 dark:bg-amber-700/30 p-1 rounded-full">
                        <span className="flex items-center justify-center h-4 w-4 text-amber-600 dark:text-amber-400 text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${tutor.summary.totalMissedClasses > 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {tutor.summary.totalMissedClasses}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Planned Earnings</div>
                      <div className="bg-indigo-200/50 dark:bg-indigo-700/30 p-1 rounded-full">
                        <span className="flex items-center justify-center h-4 w-4 text-indigo-600 dark:text-indigo-400 text-xs font-bold">RM</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">RM {tutor.summary.totalPlannedEarnings.toFixed(2)}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl shadow-sm border border-purple-100 dark:border-purple-800/50 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Actual Earnings</div>
                      <div className="bg-purple-200/50 dark:bg-purple-700/30 p-1 rounded-full">
                        <span className="flex items-center justify-center h-4 w-4 text-purple-600 dark:text-purple-400 text-xs font-bold">RM</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">RM {tutor.summary.totalActualEarnings.toFixed(2)}</div>
                  </div>
                </div>
              )}
              
              {/* Student Details Section (Expandable) */}
              {!tutor.isLoading && !tutor.error && tutor.summary && tutor.isExpanded && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Student Details ({tutor.students.length})</h3>
                  
                  {tutor.students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No students assigned to this tutor.</p>
                  ) : (
                    <div className="space-y-4">
                      {tutor.students.map(student => (
                        <Card key={student.studentId} className="overflow-hidden border-l-4" 
                              style={{ borderLeftColor: student.completionRate >= 90 ? '#10b981' : 
                                                     student.completionRate >= 75 ? '#0ea5e9' :
                                                     student.completionRate >= 50 ? '#f59e0b' : '#ef4444' }}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              {/* Student Info */}
                              <div className="mb-4 md:mb-0">
                                <h4 className="text-base font-semibold">{student.studentName || 'Unnamed Student'}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-2">
                                  <div><span className="text-muted-foreground">Age:</span> {student.age || 'N/A'}</div>
                                  <div><span className="text-muted-foreground">School:</span> {student.school || 'N/A'}</div>
                                  <div><span className="text-muted-foreground">Level:</span> {student.level || 'N/A'}</div>
                                  <div><span className="text-muted-foreground">Subjects:</span> {student.subjects ? student.subjects.join(', ') : 'N/A'}</div>
                                  <div><span className="text-muted-foreground">Session:</span> {student.sessionFrequency || 'N/A'}</div>
                                  <div><span className="text-muted-foreground">Duration:</span> {student.sessionDuration || 'N/A'}</div>
                                </div>
                              </div>
                              
                              {/* Performance Metrics */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-center">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 rounded-lg shadow-sm border border-blue-100/50 dark:border-blue-800/30">
                                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Planned</div>
                                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{student.plannedClasses}</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 rounded-lg shadow-sm border border-green-100/50 dark:border-green-800/30">
                                  <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Actual</div>
                                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{student.actualClasses}</div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-2 rounded-lg shadow-sm border border-amber-100/50 dark:border-amber-800/30">
                                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Missed</div>
                                  <div className={`text-lg font-bold ${student.missedClasses > 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {student.missedClasses}
                                  </div>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-2 rounded-lg shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
                                  <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Rate</div>
                                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">RM {student.tutorHourlyRate}/hr</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-2 rounded-lg shadow-sm border border-purple-100/50 dark:border-purple-800/30">
                                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Earnings</div>
                                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">RM {student.actualEarnings.toFixed(2)}</div>
                                </div>
                                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-2 rounded-lg shadow-sm border border-teal-100/50 dark:border-teal-800/30">
                                  <div className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-1">Completion</div>
                                  <div className={`text-lg font-bold ${
                                    student.completionRate >= 90 ? 'text-green-500 dark:text-green-400' : 
                                    student.completionRate >= 75 ? 'text-blue-500 dark:text-blue-400' :
                                    student.completionRate >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                                  }`}>
                                    {student.completionRate}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {totalPages > 1 && !isLoadingTutors && !isLoadingReports && paginatedData.length > 0 && (
          <div className="flex flex-col items-center justify-center py-6 mt-2">
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
              {/* First Page Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First Page"
              >
                <ChevronLeft className="h-4 w-4 stroke-2" />
                <ChevronLeft className="h-4 w-4 stroke-2 -ml-3" />
              </Button>
              
              {/* Previous Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4 stroke-2" />
              </Button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  // Show all pages if 5 or fewer
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Near start
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Near end
                  pageNum = totalPages - 4 + i;
                } else {
                  // Middle
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                      currentPage === pageNum 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' 
                        : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              {/* Next Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4 stroke-2" />
              </Button>
              
              {/* Last Page Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
              >
                <ChevronRight className="h-4 w-4 stroke-2" />
                <ChevronRight className="h-4 w-4 stroke-2 -ml-3" />
              </Button>
            </div>
            
            {/* Page Info */}
            <span className="text-sm text-muted-foreground mt-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </Suspense>
  );
}
