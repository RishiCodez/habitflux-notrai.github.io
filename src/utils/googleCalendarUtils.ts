
// Google Calendar API utilities
import { toast } from "sonner";

// Google Calendar API endpoint
const API_BASE_URL = 'https://www.googleapis.com/calendar/v3';

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

// Get user's calendar events
export const fetchCalendarEvents = async (startDate: Date, endDate: Date): Promise<GoogleCalendarEvent[]> => {
  const token = localStorage.getItem('googleCalendarToken');
  
  if (!token) {
    toast.error("Not connected to Google Calendar");
    return [];
  }
  
  try {
    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();
    
    const response = await fetch(
      `${API_BASE_URL}/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('googleCalendarToken');
        toast.error("Google Calendar session expired. Please reconnect.");
        return [];
      }
      throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items as GoogleCalendarEvent[];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    toast.error("Failed to fetch calendar events");
    return [];
  }
};

// Convert Google Calendar events to our app's event format
export const convertGoogleEventToAppEvent = (googleEvent: GoogleCalendarEvent) => {
  return {
    id: googleEvent.id,
    title: googleEvent.summary,
    start: new Date(googleEvent.start.dateTime).toTimeString().substring(0, 5),
    end: new Date(googleEvent.end.dateTime).toTimeString().substring(0, 5),
    category: 'meeting' as const // Default category for Google Calendar events
  };
};

// Function to check if the Google Calendar token is valid
export const validateGoogleCalendarToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('googleCalendarToken');
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/calendars/primary/events?maxResults=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};
