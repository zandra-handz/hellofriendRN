/**
 * Converts an ISO date string like "2026-03-14" into a readable weekday/month/day label.
 * Parses manually to avoid UTC timezone shifting.
 *
 * Current year:  "Friday, March 14"
 * Other year:    "Friday, March 14, 2025"
 */
export const isoDateToWeekdayMonthDay = (dateStr: string): string => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const isCurrentYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  });
};

/**
 * Returns the number of whole days between a past date field and today.
 */
export const daysSincedDateField = (date) => {
  const meetDate = new Date(date);
  const today = new Date();

  meetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysAgo = Math.floor((today.getTime() - meetDate.getTime()) / msPerDay);

  return daysAgo;
};

/**
 * Converts a full ISO 8601 datetime string (e.g. "2026-03-28T16:55:38.014345Z")
 * into a readable weekday/month/day label, using local date.
 *
 * Current year:  "Friday, March 28"
 * Other year:    "Friday, March 28, 2025"
 */
export const isoDateTimeToWeekdayMonthDay = (dateTimeStr: string, { alwaysShowYear = false } = {}): string => {
  if (!dateTimeStr) return "";

  const date = new Date(dateTimeStr);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const includeYear = alwaysShowYear || !isCurrentYear;

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  });
};

/**
 * Formats a YYYY-MM-DD date string as "Weekday, Mon Day" (e.g. "Friday, Mar 5").
 * Parses manually to avoid UTC timezone shifting.
 */
export const formatDayOfWeekAbbrevMonth = (dateString, { locale = "en-US" } = {}) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const weekday = date.toLocaleString(locale, { weekday: "long" });
  const shortMonth = date.toLocaleString(locale, { month: "short" });

  return `${weekday}, ${shortMonth} ${day}`;
};

/**
 * Returns the age in whole years given any date string (ISO 8601 or YYYY-MM-DD).
 * e.g. "2026-03-28T16:55:38.014345Z" → 0  (less than a year old)
 *      "2024-03-28T16:55:38.014345Z" → 2
 */
/**
 * Returns the number of whole seconds remaining until an ISO 8601 datetime.
 * Returns 0 if the time has already passed.
 * e.g. "2026-04-12T16:07:01.011432Z" → 42
 */
export const secondsUntil = (isoDatetime: string): number => {
  const ms = new Date(isoDatetime).getTime() - Date.now();
  return Math.max(0, Math.floor(ms / 1000));
};

export const convertDjangoISO8601Time_toDateNow = (isoDatetime: string): number => {
  return new Date(isoDatetime).getTime();
};

export const getAgeFromDate = (dateStr: string): number => {
  if (!dateStr) return 0;

  const birth = new Date(dateStr);
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();
  const hasBirthdayPassedThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

  if (!hasBirthdayPassedThisYear) age -= 1;

  return age;
};
