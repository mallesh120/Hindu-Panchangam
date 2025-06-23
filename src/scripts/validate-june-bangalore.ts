import { getPanchangam, yogaNames, karanaNames, tithiNames, nakshatraNames } from '../index';
import { Observer } from 'astronomy-engine';

const BANGALORE_LAT = 12.9716;
const BANGALORE_LON = 77.5946;
const BANGALORE_ELEVATION = 920;

const observer = new Observer(BANGALORE_LAT, BANGALORE_LON, BANGALORE_ELEVATION);

const varaNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTimeIST(date: Date | null): string {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

console.log("| Date       | Tithi         | Nakshatra      | Yoga           | Karana   | Vara     | Sunrise | Sunset  | Moonrise | Moonset |");
console.log("|------------|---------------|---------------|---------------|----------|----------|---------|---------|----------|---------|");

for (let day = 1; day <= 30; day++) {
    const date = new Date(Date.UTC(2025, 5, day, 0, 0, 0)); // June is month 5 (0-based)
    const p = getPanchangam(date, observer);
    const tithi = String(tithiNames[p.tithi] || p.tithi);
    const nakshatra = String(nakshatraNames[p.nakshatra] || p.nakshatra);
    const yoga = String(yogaNames[p.yoga] || p.yoga);
    const karana = String(p.karana);
    const vara = String(varaNames[p.vara] || p.vara);
    const sunrise = formatTimeIST(p.sunrise);
    const sunset = formatTimeIST(p.sunset);
    const moonrise = formatTimeIST(p.moonrise);
    const moonset = formatTimeIST(p.moonset);
    console.log(`| 2025-06-${day.toString().padStart(2, '0')} | ${tithi.padEnd(13)} | ${nakshatra.padEnd(13)} | ${yoga.padEnd(13)} | ${karana.padEnd(8)} | ${vara.padEnd(8)} | ${sunrise} | ${sunset} | ${moonrise} | ${moonset} |`);
    // Print Tithi transitions
    if (p.tithiTransitions && p.tithiTransitions.length > 0) {
        console.log('    Tithi transitions:');
        for (const tt of p.tithiTransitions) {
            const name = tt.name;
            const endTime = formatTimeIST(tt.endTime);
            console.log(`      - ${name.padEnd(13)} upto ${endTime} IST`);
        }
    }
    // Print Nakshatra transitions
    if (p.nakshatraTransitions && p.nakshatraTransitions.length > 0) {
        console.log('    Nakshatra transitions:');
        for (const nt of p.nakshatraTransitions) {
            const name = nt.name;
            const endTime = formatTimeIST(nt.endTime);
            console.log(`      - ${name.padEnd(13)} upto ${endTime} IST`);
        }
    }
    // Print Yoga transitions
    if (p.yogaTransitions && p.yogaTransitions.length > 0) {
        console.log('    Yoga transitions:');
        for (const yt of p.yogaTransitions) {
            const name = yt.name;
            const endTime = formatTimeIST(yt.endTime);
            console.log(`      - ${name.padEnd(13)} upto ${endTime} IST`);
        }
    }
    // Print Karana transitions
    if (p.karanaTransitions && p.karanaTransitions.length > 0) {
        console.log('    Karana transitions:');
        for (const kt of p.karanaTransitions) {
            const name = kt.name;
            const endTime = formatTimeIST(kt.endTime);
            console.log(`      - ${name.padEnd(10)} upto ${endTime} IST`);
        }
    }
} 