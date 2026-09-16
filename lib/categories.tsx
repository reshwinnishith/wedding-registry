import type { ReactElement } from "react";
import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  "Kitchen",
  "Home & Living",
  "Dining",
  "Electronics",
  "Toys & Games",
  "Experiences",
  "Keepsakes",
  "Travel",
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CATEGORY_ICONS: Record<Category, ReactElement> = {
  Kitchen: (
    <svg {...iconProps}>
      <path d="M5 10h14l-1.5 7a2 2 0 0 1-2 1.6H8.5a2 2 0 0 1-2-1.6L5 10Z" />
      <path d="M8 10a4 4 0 0 1 8 0" />
      <path d="M12 3v3" />
    </svg>
  ),
  "Home & Living": (
    <svg {...iconProps}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  Dining: (
    <svg {...iconProps}>
      <path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3Z" />
      <path d="M12 12v6" />
      <path d="M9 20h6" />
    </svg>
  ),
  Electronics: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4V2M12 22v-2" />
    </svg>
  ),
  "Toys & Games": (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Experiences: (
    <svg {...iconProps}>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M4 13h16" />
    </svg>
  ),
  Keepsakes: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M5 17l4.5-4.5a2 2 0 0 1 2.8 0L19 19" />
    </svg>
  ),
  Travel: (
    <svg {...iconProps}>
      <path d="M10.5 20.5 12 15l-7.5 2v-1.6L12 11V5.5a1.5 1.5 0 0 1 3 0V11l7.5 4.4V17L15 15l1.5 5.5-1.5-1-1.5 1Z" />
    </svg>
  ),
};
