const REGEX_UTC_TIME = /^(\d{1,2}):(\d{2})\s*(UTC)$/i;
const REGEX_UTC_DATE_TIME =
  /^(\d{1,2}) (\w+) (\d{4})\s*\|\s*(\d{1,2}):(\d{2})\s*(UTC)$/i;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function to12Hour(hours: number, minutes: string): string {
  const suffix = hours >= 12 ? "PM" : "AM";
  let hours12 = hours;
  if (hours12 > 12) {
    hours12 -= 12;
  } else if (hours12 === 0) {
    hours12 = 12;
  }
  return `${hours12}:${minutes} ${suffix} UTC`;
}

export function ordinalSuffix(day: number): string {
  if (day % 10 === 1 && day % 100 !== 11) return "st";
  if (day % 10 === 2 && day % 100 !== 12) return "nd";
  if (day % 10 === 3 && day % 100 !== 13) return "rd";
  return "th";
}

export function formatUtcTime(utcOriginal: string): string | null {
  const match = utcOriginal.match(REGEX_UTC_TIME);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutesNum = parseInt(match[2], 10);

  if (isNaN(hours) || isNaN(minutesNum) || hours > 23 || minutesNum > 59)
    return null;

  return to12Hour(hours, match[2]);
}

export function formatUtcDateTime(utcOriginal: string): string | null {
  const match = utcOriginal.match(REGEX_UTC_DATE_TIME);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const monthName = match[2];
  const year = parseInt(match[3], 10);
  const hours = parseInt(match[4], 10);
  const minutesNum = parseInt(match[5], 10);

  const monthIndex = MONTH_NAMES.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (
    monthIndex === -1 ||
    isNaN(day) ||
    isNaN(year) ||
    isNaN(hours) ||
    isNaN(minutesNum) ||
    hours > 23 ||
    minutesNum > 59
  )
    return null;

  const date = new Date(Date.UTC(year, monthIndex, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  )
    return null;

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });

  return `${weekday}, ${monthName} ${day}${ordinalSuffix(day)} at ${to12Hour(
    hours,
    match[5]
  )}`;
}
