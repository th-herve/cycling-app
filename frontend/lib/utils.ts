import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateShort = (date: string) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export const getMonthShort = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
  });
};
export const getDay = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
  });
};

export const formatDateRange = (start: string, end?: string) => {
  if (!start) return null;

  if (!end) {
    return formatDateShort(start);
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${getDay(start)} - ${getDay(end)} ${getMonthShort(start)}`;
  }

  return `${formatDateShort(start)} - ${formatDateShort(end)}`;
};
