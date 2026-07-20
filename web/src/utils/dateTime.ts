import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with UTC plugin
dayjs.extend(utc);

interface RelativeTimeResult {
  key: string;
  time?: number;
}

type TranslateFunction = (key: string, options?: Record<string, unknown>) => string;

/**
 * Get relative time information for a given UTC timestamp
 * @param utcTime - The UTC time to compare against current time
 * @returns Object containing the translation key and time value (if applicable)
 */
export const getRelativeTimeKey = (
  utcTime: string | Date | number | null
): RelativeTimeResult | null => {
  if (!utcTime) {
    return null;
  }

  const now = dayjs();
  const then = dayjs.utc(utcTime);

  if (!then.isValid()) {
    return null;
  }

  // Calculate the difference in seconds
  const diffInSeconds = now.diff(then, 'second');
  const absDiff = Math.abs(diffInSeconds);

  // Less than 45 seconds
  if (absDiff < 45) {
    return { key: 'sec' };
  }

  // Less than 90 seconds (1.5 minutes)
  if (absDiff < 90) {
    return { key: 'min' };
  }

  // Calculate minutes
  const diffInMinutes = Math.round(absDiff / 60);

  // Less than 45 minutes
  if (diffInMinutes < 45) {
    return { key: 'minTime', time: diffInMinutes };
  }

  // Less than 90 minutes (1.5 hours)
  if (diffInMinutes < 90) {
    return { key: 'hour' };
  }

  // Calculate hours
  const diffInHours = Math.round(absDiff / 3600);

  // Less than 22 hours
  if (diffInHours < 22) {
    return { key: 'hourTime', time: diffInHours };
  }

  // Calculate days
  const diffInDays = Math.round(absDiff / 86400);

  // Less than 26 days
  if (diffInDays === 1) {
    return { key: 'day' };
  }

  if (diffInDays < 26) {
    return { key: 'dayTime', time: diffInDays };
  }

  // Calculate weeks
  const diffInWeeks = Math.round(absDiff / (86400 * 7));

  // Less than 45 days (approximately 6 weeks)
  if (diffInWeeks === 1) {
    return { key: 'week' };
  }

  if (diffInDays < 45) {
    return { key: 'weekTime', time: diffInWeeks };
  }

  // Calculate months (dayjs diff returns integer, so we calculate fractional manually)
  const diffInMonths = absDiff / (86400 * 30);
  const roundedMonths = Math.round(diffInMonths);

  // Less than 320 days (approximately 10.5 months)
  if (roundedMonths === 1) {
    return { key: 'month' };
  }

  if (roundedMonths < 11) {
    return { key: 'monthTime', time: roundedMonths };
  }

  // Calculate years
  const diffInYears = absDiff / (86400 * 365);
  const roundedYears = Math.round(diffInYears);

  if (roundedYears === 1) {
    return { key: 'year' };
  }

  return { key: 'yearTime', time: roundedYears };
};

/**
 * Format a relative time string using the translation function
 * @param utcTime - The UTC time to compare against current time
 * @param t - The translation function from i18next
 * @returns The formatted relative time string or null if invalid
 */
export const formatRelativeTime = (
  utcTime: string | Date | number | null,
  t: TranslateFunction
): string | null => {
  const result = getRelativeTimeKey(utcTime);

  if (!result) {
    return null;
  }

  if (result.time !== undefined) {
    return t(`header.time.${result.key}`, { time: result.time });
  }

  // Use header.time prefix for all relative time keys
  return t(`header.time.${result.key}`);
};

/**
 * Format a UTC date to a local date string in DD-MM-YYYY format
 * @param utcDate - The UTC date to format
 * @returns The formatted date string or empty string if invalid
 */
export const dateView = (utcDate: string | Date | number | null): string => {
  if (!utcDate) {
    return '';
  }
  const date = dayjs.utc(utcDate);
  if (!date.isValid()) {
    return '';
  }
  return date.local().format('MM-DD-YYYY');
};

/**
 * Format a UTC date-time to a local date-time string in DD-MM-YYYY hh:mm A format
 * @param utcDateTime - The UTC date-time to format
 * @returns The formatted date-time string or empty string if invalid
 */
export const dateTimeView = (utcDateTime: string | Date | number | null): string => {
  if (!utcDateTime) {
    return '';
  }
  const date = dayjs.utc(utcDateTime);
  if (!date.isValid()) {
    return '';
  }
  return date.local().format('MM-DD-YYYY hh:mm A');
};
