// src/index.ts
import { Observer } from "astronomy-engine";
import { generateHtmlCalendar } from "./generator";
import * as fs from 'fs';

// San Diego location details
const observerInfo = { 
    latitude: 12.9716,
    longitude: 77.5946,
    elevation: 920, // in meters
    timeZone: "Asia/Kolkata"// IANA time zone for San Diego
};

const observer = new Observer(observerInfo.latitude, observerInfo.longitude, observerInfo.elevation);

const year = 2025;
const month = 6; // June

console.log(`Generating HTML calendar for ${year}-${month}...`);

const htmlContent = generateHtmlCalendar(year, month, observer, observerInfo.timeZone);
fs.writeFileSync('panchangam.html', htmlContent);

console.log('Successfully created panchangam.html');

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
