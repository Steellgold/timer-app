import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

export const numberFormat = (value: string, maxValue: number): string => {
  const intValue = Number(value);
  if (!Number.isFinite(intValue)) return "";
  return String(Math.min(intValue, maxValue)).padStart(2, "0").slice(-2);
};