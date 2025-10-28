export function formatLocalDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    // weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta', // Force WIB regardless of environment
  };

  return date.toLocaleDateString('en-US', options).replace(',', ''); // remove comma after weekday
}

export function formatLocalDateTimeServer(isoString: string) {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta', // Force WIB regardless of environment
  };

  return date.toLocaleDateString('en-US', options);
}

export function formatLocalDateTimeJKT(isoString: string) {
  const date = new Date(isoString);

  // convert date to Asia/Jakarta timezone manually
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Example output: "2025-10-12, 18:00:00"
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  // return ISO string with +07:00 offset
  return `${year}-${month}-${day}T${hour}:${minute}:${second}+07:00`;
}

export function addMinutesJKT(dateString: string, minutesToAdd: number) {
  // Convert string to Date object
  const date = new Date(dateString);

  // Add minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Convert back to +07:00 ISO string
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+07:00`;
}

export const combineToUTC = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.toISOString();
};

export const UTCToLocalTimezone = (utc: string) => {
  const date = new Date(utc);

  const datePart = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format
  }).format(date);

  return `${datePart} ${timePart}`;
};
// Combine local date + time into UTC ISO string
export const combineDateTimeToUTC = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setUTCHours(hours, minutes, 0, 0); // Set in UTC
  return combined.toISOString();
};

// Add minutes to a UTC ISO string
export const addMinutesUTC = (utcISOString: string, minutes: number) => {
  const date = new Date(utcISOString);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString();
};

// Display UTC ISO in Jakarta local time for UI
export const UTCToJakarta = (utcISOString: string) => {
  const date = new Date(utcISOString);
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const combineJakartaDateTimeToUTC = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);

  // Create a date in Jakarta timezone first
  const jakartaDate = new Date(date);
  jakartaDate.setHours(hours, minutes, 0, 0);

  // Offset Jakarta (+07:00) → UTC
  const utcDate = new Date(jakartaDate.getTime() - 7 * 60 * 60 * 1000);

  return utcDate.toISOString();
};

export const formatJakartaDate = (utcISOString: string) => {
  const date = new Date(utcISOString);
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
export const formatJakartaHour = (utcISOString: string) => {
  const date = new Date(utcISOString);
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const combineJakartaDateTimeToUTCForCalendar = (date: Date | string) => {
  const d = new Date(date);
  // Format as ISO string, but don't shift to UTC
  const iso = d.toISOString();
  return iso.split('.')[0]; // remove milliseconds
};
