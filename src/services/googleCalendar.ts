import { CalendarEvent } from '../types';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleCalendar = async () => {
  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    await new Promise<void>((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        resolve();
      });
    });

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // Will be set later
    });
    gisInited = true;

    return true;
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    return false;
  }
};

export const authenticateGoogleCalendar = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (resp) => {
        if (resp.error) {
          reject(resp);
        }
        resolve();
      };
      
      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const syncEventsToGoogle = async (events: CalendarEvent[]): Promise<void> => {
  try {
    for (const event of events) {
      const googleEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.date.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(event.date.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: googleEvent,
      });
    }
  } catch (error) {
    console.error('Error syncing events to Google Calendar:', error);
    throw error;
  }
};

export const importEventsFromGoogle = async (): Promise<CalendarEvent[]> => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.result.items.map((item: any) => ({
      id: item.id,
      title: item.summary,
      description: item.description || '',
      date: new Date(item.start.dateTime || item.start.date),
      color: 'blue',
      recurrence: { type: 'none' },
    }));
  } catch (error) {
    console.error('Error importing events from Google Calendar:', error);
    throw error;
  }
};