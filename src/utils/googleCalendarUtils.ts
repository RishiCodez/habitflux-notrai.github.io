
// This file has been simplified to remove Google Calendar integration
import { toast } from "sonner";

// Type definition kept for compatibility with any existing imports
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
}

// Placeholder function in case it's referenced elsewhere
export const fetchCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
  toast.error("Google Calendar integration has been removed");
  return [];
};

// Placeholder function in case it's referenced elsewhere
export const convertGoogleEventToAppEvent = (googleEvent: GoogleCalendarEvent) => {
  return {
    id: googleEvent.id,
    title: googleEvent.summary,
    start: new Date(googleEvent.start.dateTime).toTimeString().substring(0, 5),
    end: new Date(googleEvent.end.dateTime).toTimeString().substring(0, 5),
    category: 'meeting' as const
  };
};

// Placeholder function in case it's referenced elsewhere
export const validateGoogleCalendarToken = async (): Promise<boolean> => {
  return false;
};
