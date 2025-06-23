import { Observer } from "astronomy-engine";
import { getPanchangam } from "../panchangam";
import { DateTime } from "luxon";

// San Diego location details
const observerInfo = { 
    latitude: 32.7157, 
    longitude: -117.1611, 
    elevation: 20,
    timeZone: 'America/Los_Angeles'
};

const observer = new Observer(observerInfo.latitude, observerInfo.longitude, observerInfo.elevation);

const tithiNames = [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

const nakshatraNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

function formatTime(date: Date | null, timeZone: string): string {
    if (!date) return 'N/A';
    return DateTime.fromJSDate(date).setZone(timeZone).toFormat('yyyy-MM-dd HH:mm');
}

function validateTithiTimes() {
    console.log("=== TITHI VALIDATION FOR JUNE 2025 (San Diego) ===\n");
    
    // Test dates: June 1, 10 (Purnima), 15, 21, 30
    const testDates = [
        new Date(2025, 5, 1),   // June 1
        new Date(2025, 5, 10),  // June 10 (Purnima)
        new Date(2025, 5, 15),  // June 15
        new Date(2025, 5, 21),  // June 21
        new Date(2025, 5, 30)   // June 30
    ];

    testDates.forEach(date => {
        const panchangam = getPanchangam(date, observer);
        const dateStr = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd (EEEE)');
        
        console.log(`Date: ${dateStr}`);
        console.log(`Tithi: ${tithiNames[panchangam.tithi]} (${panchangam.tithi})`);
        console.log(`Tithi Start: ${formatTime(panchangam.tithiStartTime, observerInfo.timeZone)}`);
        console.log(`Tithi End: ${formatTime(panchangam.tithiEndTime, observerInfo.timeZone)}`);
        console.log(`Nakshatra: ${nakshatraNames[panchangam.nakshatra]} (${panchangam.nakshatra})`);
        console.log(`Nakshatra Start: ${formatTime(panchangam.nakshatraStartTime, observerInfo.timeZone)}`);
        console.log(`Nakshatra End: ${formatTime(panchangam.nakshatraEndTime, observerInfo.timeZone)}`);
        console.log(`Sunrise: ${formatTime(panchangam.sunrise, observerInfo.timeZone)}`);
        console.log(`Sunset: ${formatTime(panchangam.sunset, observerInfo.timeZone)}`);
        console.log(`Moonrise: ${formatTime(panchangam.moonrise, observerInfo.timeZone)}`);
        console.log(`Moonset: ${formatTime(panchangam.moonset, observerInfo.timeZone)}`);
        console.log("---\n");
    });

    console.log("=== VALIDATION INSTRUCTIONS ===");
    console.log("1. Compare these times with drikpanchang.com for San Diego");
    console.log("2. Check mypanchang.com for June 2025 panchangam");
    console.log("3. Verify with any other authoritative panchangam source");
    console.log("4. Pay special attention to Purnima (June 10) and Amavasya dates");
    console.log("5. Note any discrepancies in tithi start/end times");
}

validateTithiTimes(); 