import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const TAG_BG_CLASSES = {
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  amber: 'bg-amber-100',
  yellow: 'bg-yellow-100',
  lime: 'bg-lime-100',
  green: 'bg-green-100',
  emerald: 'bg-emerald-100',
  teal: 'bg-teal-100',
  cyan: 'bg-cyan-100',
  sky: 'bg-sky-100',
  blue: 'bg-blue-100',
  indigo: 'bg-indigo-100',
  violet: 'bg-violet-100',
  purple: 'bg-purple-100',
  fuchsia: 'bg-fuchsia-100',
  pink: 'bg-pink-100',
  rose: 'bg-rose-100',
};

export const TAG_TEXT_CLASSES = {
  red: 'text-red-600',
  orange: 'text-orange-600',
  amber: 'text-amber-600',
  yellow: 'text-yellow-600',
  lime: 'text-lime-600',
  green: 'text-green-600',
  emerald: 'text-emerald-600',
  teal: 'text-teal-600',
  cyan: 'text-cyan-600',
  sky: 'text-sky-600',
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
  violet: 'text-violet-600',
  purple: 'text-purple-600',
  fuchsia: 'text-fuchsia-600',
  pink: 'text-pink-600',
  rose: 'text-rose-600',
};
