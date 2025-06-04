'use server';
//remove all console.log statements
import { db } from '@/db/db';
export interface StudentReportEntry {
  studentId: string;
  studentName: string | null;
  // Basic student info
  age: string | null;
  school: string | null;
  level: string | null;
  subjects: string[] | null;
  sessionFrequency: string | null;
  sessionDuration: string | null;
  // Class metrics
  plannedClasses: number;
  actualClasses: number;
  missedClasses: number;
  plannedEarnings: number;
  actualEarnings: number;
  // Tutor-student relationship details
  tutorHourlyRate: number;
  // Performance metrics
  completionRate: number; // percentage of planned classes completed
}

export interface TutorReportSummary {
  totalPlannedClasses: number;
  totalActualClasses: number;
  totalMissedClasses: number;
  totalPlannedEarnings: number;
  totalActualEarnings: number;
}

export interface TutorReportData {
  tutor: { id: string; name: string | null; adminId?: string | null; phone?: string | null; } | null;
  studentsReport: StudentReportEntry[];
  summary: TutorReportSummary;
  error?: string;
}

// Type for basic tutor information, used by the tutor report page
export type BasicTutorInfo = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};
// Helper function to parse Student.sessionDuration (e.g., "1 hour", "1.5 hours", "2 hrs")
function parseSessionDurationToHours(durationString: string | null | undefined): number {
  if (!durationString) return 0;
  // Remove "hours", "hour", "hrs", "hr" and trim whitespace
  const cleanedString = durationString.toLowerCase()
                                     .replace(/hours|hour|hrs|hr/g, '')
                                     .trim();
  const numericValue = parseFloat(cleanedString);
  return isNaN(numericValue) ? 0 : numericValue;
}

// Helper function to calculate planned classes from sessionFrequency (number of classes per week)
// Always uses exactly 4 weeks per month for consistency
function calculatePlannedClasses(frequencyString: string | null | undefined, daysInMonth: number): number {
  if (!frequencyString) {
    return 0;
  }
  
  
  // Try to extract a number from the string
  const numericValue = parseFloat(frequencyString.replace(/[^0-9.]/g, ''));
  
  // If we have a valid number, use it as classes per week
  if (!isNaN(numericValue) && numericValue > 0) {
    // Always use exactly 4 weeks per month
    const weeksInMonth = 4;
    const plannedClasses = numericValue * weeksInMonth;
    return plannedClasses;
  }
  
  // Special cases for common text formats
  const lowerFrequency = frequencyString.toLowerCase().trim();
  
  if (lowerFrequency.includes('once') || lowerFrequency === '1' || lowerFrequency === 'weekly') {
    // 1 class per week × 4 weeks
    const classes = 4;
    return classes;
  }
  
  if (lowerFrequency.includes('twice') || lowerFrequency === '2') {
    // 2 classes per week × 4 weeks
    const classes = 8;
    return classes;
  }
  
  if (lowerFrequency.includes('daily')) {
    // For daily, use 28 days (4 weeks × 7 days)
    const classes = 28;
    return classes;
  }
  
  // Default fallback
  return 0;
}

interface TutorReportArgs {
  tutorId: string;
  year: number;
  month: number; // 1 for January, 12 for December
}



// Server action to get all active tutors
export async function getAllActiveTutorsServerAction(): Promise<BasicTutorInfo[]> {
  try {
    
    const tutors = await db.user.findMany({
      where: {
        role: 'tutor',
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    
    // If no tutors are found, add a fallback for testing
    if (tutors.length === 0) {
      console.log('No active tutors found in the database, checking for tutors with any status...');
      
      // Try to fetch any tutors regardless of status to see if there are any tutors at all
      const anyTutors = await db.user.findMany({
        where: {
          role: 'tutor',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true
        },
      });

    }
    
    return tutors;
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return [];
  }
}

export async function getTutorMonthlyReport({ tutorId, year, month }: TutorReportArgs): Promise<TutorReportData> {
  try {
    
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); 
    const daysInMonth = endDate.getUTCDate();
    
    const tutorUser = await db.user.findUnique({
      where: { id: tutorId, role: 'tutor' },
      select: { id: true, name: true, adminId: true, phone: true }
    });

    if (!tutorUser) {
      return { tutor: null, studentsReport: [], summary: {} as TutorReportSummary, error: 'Tutor not found or user is not a tutor.' };
    }
    

    const studentTutorLinks = await db.studentTutor.findMany({
      where: { tutorId: tutorId },
      include: {
        student: true,
      },
    });
    
    const initialSummary: TutorReportSummary = {
      totalPlannedClasses: 0,
      totalActualClasses: 0,
      totalMissedClasses: 0,
      totalPlannedEarnings: 0,
      totalActualEarnings: 0,
    };

    if (!studentTutorLinks.length) {
      console.log('No students assigned to this tutor');
      return {
        tutor: tutorUser,
        studentsReport: [],
        summary: initialSummary,
      };
    }

    const studentsReport: StudentReportEntry[] = [];
    let overallPlannedClasses = 0;
    let overallActualClasses = 0;
    let overallPlannedEarnings = 0;
    let overallActualEarnings = 0;

    for (const link of studentTutorLinks) {
      if (!link.student) {
        console.log('Skipping link with no student data');
        continue;
      }

      const student = link.student;
      const tutorHourlyRate = link.tutorhourly; // Float
      

      const plannedClassesCount = calculatePlannedClasses(student.sessionFrequency, daysInMonth);
      const plannedHoursPerClass = parseSessionDurationToHours(student.sessionDuration);
      const plannedEarningsForStudent = plannedClassesCount * plannedHoursPerClass * tutorHourlyRate;
      

      const actualLessons = await db.lesson.findMany({
        where: {
          studentId: student.id,
          tutorId: tutorId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      
      console.log(`Found ${actualLessons.length} actual lessons for the period`);

      const actualClassesCount = actualLessons.length;
      const missedClassesCount = Math.max(0, plannedClassesCount - actualClassesCount); // Ensure non-negative

      let actualEarningsForStudent = 0;
      for (const lesson of actualLessons) {
        if (lesson.totalDuration != null) { // totalDuration is Int? (minutes)
          const lessonDurationHours = lesson.totalDuration / 60;
          const lessonEarning = lessonDurationHours * tutorHourlyRate;
          actualEarningsForStudent += lessonEarning;
          console.log(`Lesson on ${new Date(lesson.date).toLocaleDateString()}: ${lesson.totalDuration} mins = ${lessonDurationHours.toFixed(2)} hrs, earning: $${lessonEarning.toFixed(2)}`);
        } else {
          console.log(`Lesson on ${new Date(lesson.date).toLocaleDateString()} has no duration recorded`);
        }
      }

      // Calculate completion rate as a percentage (actual/planned), defaulting to 0 if no planned classes
      const completionRate = plannedClassesCount > 0 
        ? Math.min(100, Math.round((actualClassesCount / plannedClassesCount) * 100)) 
        : 0;
        
      const studentReport: StudentReportEntry = {
        studentId: student.id,
        studentName: student.name,
        // Student details
        age: student.age || null,
        school: student.school || null,
        level: student.level || null,
        subjects: student.subject || null, // Note: in schema it's 'subject' but it's an array
        sessionFrequency: student.sessionFrequency || null,
        sessionDuration: student.sessionDuration || null,
        // Class metrics
        plannedClasses: plannedClassesCount,
        actualClasses: actualClassesCount,
        missedClasses: missedClassesCount,
        plannedEarnings: parseFloat(plannedEarningsForStudent.toFixed(2)),
        actualEarnings: parseFloat(actualEarningsForStudent.toFixed(2)),
        // Tutor-student relationship
        tutorHourlyRate: tutorHourlyRate,
        // Performance metrics
        completionRate: completionRate
      };
      
      
      studentsReport.push(studentReport);

      overallPlannedClasses += plannedClassesCount;
      overallActualClasses += actualClassesCount;
      overallPlannedEarnings += plannedEarningsForStudent;
      overallActualEarnings += actualEarningsForStudent;
    }
    
    // Calculate the overall missed classes (ensuring it's not negative)
    const overallMissedClasses = Math.max(0, overallPlannedClasses - overallActualClasses);
    
    // Format the final numbers
    const finalSummary = {
      totalPlannedClasses: overallPlannedClasses,
      totalActualClasses: overallActualClasses,
      totalMissedClasses: overallMissedClasses,
      totalPlannedEarnings: parseFloat(overallPlannedEarnings.toFixed(2)),
      totalActualEarnings: parseFloat(overallActualEarnings.toFixed(2)),
    };
    

    return {
      tutor: tutorUser,
      studentsReport,
      summary: finalSummary,
    };

  } catch (error) {
    console.error("Error fetching tutor monthly report:", error);
    console.error(error instanceof Error ? error.stack : "No stack trace available");
    return { 
      tutor: null, 
      studentsReport: [], 
      summary: {} as TutorReportSummary, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}
