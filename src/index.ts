// src/index.ts
import { Observer } from "astronomy-engine";
import { generateHtmlCalendar } from "./generator";

// Main exports for the panchangam-js package
export { getPanchangam, getPanchangamDetails } from './panchangam';
export { generateHtmlCalendar } from './generator';

// Re-export types
export type { 
  Panchangam,
  PanchangamDetails
} from './panchangam';

// Re-export constants
export { karanaNames, yogaNames } from './panchangam';
