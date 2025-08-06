import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import duration from "dayjs/plugin/duration";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";
import isSameOrAfterPlugin from "dayjs/plugin/isSameOrAfter";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import updateLocale from "dayjs/plugin/updateLocale";
import { US_SHORT_DATE_FORMAT, US_DATE_TIME_FORMAT } from "@/configs";
// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(isSameOrBeforePlugin);
dayjs.extend(isSameOrAfterPlugin);
dayjs.extend(isBetweenPlugin);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(updateLocale);

// Set default timezone (you can change this to your preferred timezone)
dayjs.tz.setDefault("America/New_York");

// Configure relative time thresholds
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    w: "a week",
    ww: "%d weeks",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

// Utility functions for common date operations
export const formatDate = (
  date: string | Date,
  format: string = US_SHORT_DATE_FORMAT
): string => {
  if (!date) return "";
  return dayjs(date)?.format(format);
};

export const formatDateTime = (
  date: string | Date,
  format: string = US_DATE_TIME_FORMAT
): string => {
  if (!date) return "";
  return dayjs(date)?.format(format);
};

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return "";
  return dayjs(date)?.fromNow();
};

export const formatCalendar = (date: string | Date): string => {
  if (!date) return "";
  return dayjs(date)?.calendar();
};

export const isToday = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isSame(dayjs(), "day");
};

export const isYesterday = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isSame(dayjs().subtract(1, "day"), "day");
};

export const isThisWeek = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isSame(dayjs(), "week");
};

export const isThisMonth = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isSame(dayjs(), "month");
};

export const isThisYear = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isSame(dayjs(), "year");
};

export const addDays = (date: string | Date, days: number): Date | string => {
  if (!date || !days) return "";
  return dayjs(date)?.add(days, "day").toDate();
};

export const subtractDays = (
  date: string | Date,
  days: number
): Date | null => {
  if (!date || !days) return null;
  return dayjs(date)?.subtract(days, "day").toDate();
};

export const addMonths = (date: string | Date, months: number): Date | null => {
  if (!date || !months) return null;
  return dayjs(date)?.add(months, "month").toDate();
};

export const subtractMonths = (
  date: string | Date,
  months: number
): Date | null => {
  if (!date || !months) return null;
  return dayjs(date)?.subtract(months, "month").toDate();
};

export const addYears = (date: string | Date, years: number): Date | null => {
  if (!date || !years) return null;
  return dayjs(date)?.add(years, "year").toDate();
};

export const subtractYears = (
  date: string | Date,
  years: number
): Date | null => {
  if (!date || !years) return null;
  return dayjs(date)?.subtract(years, "year").toDate();
};

export const getStartOfDay = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.startOf("day").toDate();
};

export const getEndOfDay = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.endOf("day").toDate();
};

export const getStartOfWeek = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.startOf("week").toDate();
};

export const getEndOfWeek = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.endOf("week").toDate();
};

export const getStartOfMonth = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.startOf("month").toDate();
};

export const getEndOfMonth = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.endOf("month").toDate();
};

export const getStartOfYear = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.startOf("year").toDate();
};

export const getEndOfYear = (date: string | Date): Date | null => {
  if (!date) return null;
  return dayjs(date)?.endOf("year").toDate();
};

export const isValidDate = (date: string | Date): boolean => {
  if (!date) return false;
  return dayjs(date)?.isValid();
};

export const getAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  return dayjs()?.diff(dayjs(birthDate), "year");
};

export const getDaysBetween = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  if (!startDate || !endDate) return 0;
  return dayjs(endDate)?.diff(dayjs(startDate), "day");
};

export const getMonthsBetween = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  if (!startDate || !endDate) return 0;
  return dayjs(endDate)?.diff(dayjs(startDate), "month");
};

export const getYearsBetween = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  if (!startDate || !endDate) return 0;
  return dayjs(endDate)?.diff(dayjs(startDate), "year");
};

export const isDateBetween = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  if (!date || !startDate || !endDate) return false;
  return dayjs(date)?.isBetween(dayjs(startDate), dayjs(endDate), null, "[]");
};

export const isDateBefore = (
  date: string | Date,
  compareDate: string | Date
): boolean => {
  if (!date || !compareDate) return false;
  return dayjs(date)?.isBefore(dayjs(compareDate));
};

export const isDateAfter = (
  date: string | Date,
  compareDate: string | Date
): boolean => {
  if (!date || !compareDate) return false;
  return dayjs(date)?.isAfter(dayjs(compareDate));
};

export const isDateSameOrBefore = (
  date: string | Date,
  compareDate: string | Date
): boolean => {
  if (!date || !compareDate) return false;
  return dayjs(date)?.isSameOrBefore(dayjs(compareDate));
};

export const isDateSameOrAfter = (
  date: string | Date,
  compareDate: string | Date
): boolean => {
  if (!date || !compareDate) return false;
  return dayjs(date)?.isSameOrAfter(dayjs(compareDate));
};

// Timezone utilities
export const convertToTimezone = (
  date: string | Date,
  timezone: string
): Date | null => {
  if (!date) return null;
  return dayjs(date)?.tz(timezone)?.toDate();
};

export const formatInTimezone = (
  date: string | Date,
  timezone: string,
  format: string = US_DATE_TIME_FORMAT
): string | null => {
  if (!date) return null;
  return dayjs(date)?.tz(timezone)?.format(format);
};

// Duration utilities
export const createDuration = (
  amount: number,
  unit:
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "year"
) => {
  if (!amount || !unit) return null;
  return dayjs?.duration(amount, unit);
};

export const formatDuration = (
  duration: any,
  format: string = "HH:mm:ss"
): string | null => {
  if (!duration) return null;
  return dayjs?.utc(duration.asMilliseconds())?.format(format);
};

// Export dayjs instance for direct use
export default dayjs;
