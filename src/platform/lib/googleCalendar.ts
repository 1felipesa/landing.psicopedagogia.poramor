// Google Calendar API Helper & OAuth 2.0 Integration
export const DEFAULT_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '768292275452-ga6il6j763tde473sv4jumvsdkeku297.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly';

export interface CalendarEventPayload {
  summary: string;
  description: string;
  startDateTime: string; // ISO String
  endDateTime: string;   // ISO String
  patientEmail?: string;
  location?: string;
}

export interface UserCalendar {
  id: string;
  summary: string;
  primary?: boolean;
}

// Function to trigger Google OAuth authorization flow (with optional silent refresh)
export const initGoogleOAuth = (
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError?: (err: any) => void,
  silent: boolean = false
) => {
  if (!(window as any).google?.accounts?.oauth2) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      requestToken(clientId, onSuccess, onError, silent);
    };
    document.body.appendChild(script);
  } else {
    requestToken(clientId, onSuccess, onError, silent);
  }
};

const requestToken = (
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError?: (err: any) => void,
  silent: boolean = false
) => {
  try {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      prompt: silent ? '' : 'select_account',
      callback: (response: any) => {
        if (response.access_token) {
          localStorage.setItem('gcal_access_token', response.access_token);
          const expiresAt = Date.now() + (response.expires_in || 3600) * 1000;
          localStorage.setItem('gcal_token_expires_at', expiresAt.toString());
          onSuccess(response.access_token);
        } else if (response.error) {
          console.error('Google OAuth error:', response);
          if (onError) onError(response);
        }
      },
    });

    client.requestAccessToken({ prompt: silent ? '' : 'select_account' });
  } catch (err) {
    console.error('Error initializing Google token client:', err);
    if (onError) onError(err);
  }
};

// Retrieve cached access token if valid
export const getStoredAccessToken = (): string | null => {
  const token = localStorage.getItem('gcal_access_token');
  const expiresAtStr = localStorage.getItem('gcal_token_expires_at');
  if (!token || !expiresAtStr) return null;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (Date.now() >= expiresAt - 60000) {
    return null;
  }
  return token;
};

// Function to list all sub-calendars of the user (e.g. "Atendimentos Psicopedagogia por Amor")
export const listGoogleCalendars = async (accessToken: string): Promise<UserCalendar[]> => {
  const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Erro ao listar agendas da conta Google.');
  }

  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id: item.id,
    summary: item.summary,
    primary: item.primary || false,
  }));
};

// Function to create an event via Google Calendar API in a specific calendar
export const createGoogleCalendarEvent = async (
  accessToken: string,
  event: CalendarEventPayload,
  calendarId: string = 'primary'
) => {
  const body: any = {
    summary: event.summary,
    description: event.description,
    start: {
      dateTime: event.startDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'email', minutes: 1440 },
      ],
    },
  };

  if (event.patientEmail) {
    body.attendees = [{ email: event.patientEmail }];
  }

  if (event.location) {
    body.location = event.location;
  }

  const encodedCalId = encodeURIComponent(calendarId);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events?sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Erro ao criar evento no Google Agenda');
  }

  return await res.json();
};

// Function to update an existing event via Google Calendar API in a specific calendar
export const updateGoogleCalendarEvent = async (
  accessToken: string,
  eventId: string,
  event: CalendarEventPayload,
  calendarId: string = 'primary'
) => {
  const body: any = {
    summary: event.summary,
    description: event.description,
    start: {
      dateTime: event.startDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: 'America/Sao_Paulo',
    },
  };

  if (event.patientEmail) {
    body.attendees = [{ email: event.patientEmail }];
  }

  if (event.location) {
    body.location = event.location;
  }

  const encodedCalId = encodeURIComponent(calendarId);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events/${eventId}?sendUpdates=all`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Erro ao atualizar evento no Google Agenda');
  }

  return await res.json();
};

// Function to delete an event via Google Calendar API from a specific calendar
export const deleteGoogleCalendarEvent = async (
  accessToken: string,
  eventId: string,
  calendarId: string = 'primary'
) => {
  const encodedCalId = encodeURIComponent(calendarId);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events/${eventId}?sendUpdates=all`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.ok;
};
