import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export const catchAsync = async <T>(queryFn: () => Promise<T>): Promise<T | null> => {
  try {
    return await queryFn();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error executing query:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
    return null;
  }
};



export function formatIsoDate(isoDate: string | number | Date) {
  const date = new Date(isoDate);

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate}, ${formattedTime}`;
}
