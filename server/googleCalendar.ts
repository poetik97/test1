import { google, Auth } from 'googleapis';

type OAuth2Client = Auth.OAuth2Client;

// Configuração OAuth2
export function getOAuth2Client(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Gerar URL de autorização
export function getAuthUrl(oauth2Client: OAuth2Client): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    prompt: 'consent',
  });
}

// Trocar código por tokens
export async function getTokensFromCode(oauth2Client: OAuth2Client, code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

// Obter informações do utilizador
export async function getUserInfo(oauth2Client: OAuth2Client) {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return data;
}

// ============================================
// GOOGLE CALENDAR OPERATIONS
// ============================================

export interface CalendarEvent {
  id?: string;
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
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

// Listar eventos do Google Calendar
export async function listGoogleCalendarEvents(
  accessToken: string,
  timeMin?: Date,
  timeMax?: Date
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin?.toISOString() || new Date().toISOString(),
    timeMax: timeMax?.toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}

// Criar evento no Google Calendar
export async function createGoogleCalendarEvent(
  accessToken: string,
  event: CalendarEvent
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
}

// Atualizar evento no Google Calendar
export async function updateGoogleCalendarEvent(
  accessToken: string,
  eventId: string,
  event: Partial<CalendarEvent>
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: event,
  });

  return response.data;
}

// Eliminar evento do Google Calendar
export async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });

  return { success: true };
}

// Sincronizar eventos locais com Google Calendar
export async function syncEventsToGoogle(
  accessToken: string,
  localEvents: Array<{
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
  }>
) {
  const results = [];

  for (const localEvent of localEvents) {
    try {
      const googleEvent: CalendarEvent = {
        summary: localEvent.title,
        description: localEvent.description,
        start: {
          dateTime: localEvent.startDate.toISOString(),
          timeZone: 'Europe/Lisbon',
        },
        end: {
          dateTime: localEvent.endDate.toISOString(),
          timeZone: 'Europe/Lisbon',
        },
        location: localEvent.location,
      };

      const created = await createGoogleCalendarEvent(accessToken, googleEvent);
      results.push({ success: true, eventId: created.id, title: localEvent.title });
    } catch (error: any) {
      results.push({ success: false, error: error.message, title: localEvent.title });
    }
  }

  return results;
}

// Importar eventos do Google Calendar
export async function importEventsFromGoogle(
  accessToken: string,
  timeMin?: Date,
  timeMax?: Date
) {
  const googleEvents = await listGoogleCalendarEvents(accessToken, timeMin, timeMax);

  return googleEvents.map((event: any) => ({
    googleEventId: event.id,
    title: event.summary || 'Sem título',
    description: event.description,
    startDate: new Date(event.start?.dateTime || event.start?.date),
    endDate: new Date(event.end?.dateTime || event.end?.date),
    location: event.location,
    isAllDay: !event.start?.dateTime,
  }));
}

