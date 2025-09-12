export function formatLocalDateTime(isoString: string) {
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
// export function formatLocalDateTimeServer(isoString: string) {
//     const date = new Date(isoString)
//     const options: Intl.DateTimeFormatOptions = {
//         weekday: 'short',
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//         timeZone: "Asia/Jakarta" // Force WIB regardless of environment
//     };

//     return date
//         .toLocaleDateString('id-ID', options)
// }
