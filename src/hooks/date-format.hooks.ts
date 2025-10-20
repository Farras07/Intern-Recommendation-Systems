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
