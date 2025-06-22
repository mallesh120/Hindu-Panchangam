import { Observer, Body, GeoVector, Ecliptic } from "astronomy-engine";
import { DateTime } from "luxon";
import { getPanchangam } from './index';

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

function debugTithiCalculation(date: Date) {
    console.log(`\n=== DEBUG TITHI CALCULATION FOR ${DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm')} ===`);
    
    const sunVector = GeoVector(Body.Sun, date, true);
    const moonVector = GeoVector(Body.Moon, date, true);
    
    const sunEcliptic = Ecliptic(sunVector);
    const moonEcliptic = Ecliptic(moonVector);
    
    console.log(`Sun Longitude: ${sunEcliptic.elon.toFixed(6)}°`);
    console.log(`Moon Longitude: ${moonEcliptic.elon.toFixed(6)}°`);
    
    let longitudeDifference = moonEcliptic.elon - sunEcliptic.elon;
    if (longitudeDifference < 0) {
        longitudeDifference += 360;
    }
    console.log(`Longitude Difference: ${longitudeDifference.toFixed(6)}°`);
    
    const tithiIndex = Math.floor(longitudeDifference / 12);
    console.log(`Tithi Index: ${tithiIndex}`);
    console.log(`Tithi Name: ${tithiNames[tithiIndex]}`);
    
    // Check if this should be Purnima
    const tithiAngle = tithiIndex * 12;
    console.log(`Tithi Start Angle: ${tithiAngle}°`);
    console.log(`Tithi End Angle: ${(tithiIndex + 1) * 12}°`);
    console.log(`Current Angle: ${longitudeDifference.toFixed(6)}°`);
    
    // Calculate progress through the tithi
    const progress = (longitudeDifference - tithiAngle) / 12;
    console.log(`Progress through tithi: ${(progress * 100).toFixed(2)}%`);
    
    return {
        sunLon: sunEcliptic.elon,
        moonLon: moonEcliptic.elon,
        diff: longitudeDifference,
        tithiIndex,
        tithiName: tithiNames[tithiIndex],
        progress
    };
}

function checkPurnimaDates() {
    console.log("\n=== CHECKING PURNIMA DATES FOR JUNE 2025 ===");
    
    // Check dates around June 10-11 for Purnima
    for (let day = 8; day <= 12; day++) {
        const date = new Date(2025, 5, day, 12, 0, 0); // Noon time
        const result = debugTithiCalculation(date);
        
        if (result.tithiName === "Purnima") {
            console.log(`*** PURNIMA FOUND ON JUNE ${day} ***`);
        }
    }
}

function checkAmavasyaDates() {
    console.log("\n=== CHECKING AMAVASYA DATES FOR JUNE 2025 ===");
    
    // Check dates around June 24-25 for Amavasya
    for (let day = 22; day <= 26; day++) {
        const date = new Date(2025, 5, day, 12, 0, 0); // Noon time
        const result = debugTithiCalculation(date);
        
        if (result.tithiName === "Amavasya") {
            console.log(`*** AMAVASYA FOUND ON JUNE ${day} ***`);
        }
    }
}

// Run the debug analysis
checkPurnimaDates();
checkAmavasyaDates();

// Debug specific dates
console.log("\n=== DETAILED ANALYSIS OF SPECIFIC DATES ===");
const testDates = [
    new Date(2025, 5, 10, 12, 0, 0), // June 10 noon
    new Date(2025, 5, 11, 12, 0, 0), // June 11 noon
    new Date(2025, 5, 24, 12, 0, 0), // June 24 noon
    new Date(2025, 5, 25, 12, 0, 0), // June 25 noon
];

testDates.forEach(date => {
    debugTithiCalculation(date);
});

// Test: Print Panchangam for Bangalore, India for today
const bangaloreObserver = new Observer(12.9716, 77.5946, 920);
const today = new Date();
const panchangam = getPanchangam(today, bangaloreObserver);

console.log('--- Panchangam for Bangalore, India ---');
console.log('Date:', today.toISOString().split('T')[0]);
console.log('Tithi:', panchangam.tithi);
console.log('Nakshatra:', panchangam.nakshatra);
console.log('Yoga:', panchangam.yoga);
console.log('Karana:', panchangam.karana);
console.log('Vara:', panchangam.vara);
console.log('Sunrise:', panchangam.sunrise);
console.log('Sunset:', panchangam.sunset);
console.log('Moonrise:', panchangam.moonrise);
console.log('Moonset:', panchangam.moonset);
console.log('--------------------------------------'); 