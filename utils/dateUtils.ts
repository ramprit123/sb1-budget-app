import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}