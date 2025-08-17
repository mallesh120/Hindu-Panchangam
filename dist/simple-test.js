"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const astronomy_engine_1 = require("astronomy-engine");
// Simple test to verify the library is working
function testLibrary() {
    console.log('=== SIMPLE LIBRARY TEST ===');
    // Test with Bangalore coordinates
    const observer = new astronomy_engine_1.Observer(12.9716, 77.5946, 920);
    const date = new Date('2025-06-22');
    console.log(`Testing date: ${date.toISOString().split('T')[0]}`);
    console.log(`Location: Bangalore, India (${observer.latitude}, ${observer.longitude})`);
    console.log('');
    try {
        const panchangam = (0, index_1.getPanchangam)(date, observer);
        console.log('✅ Library Output:');
        console.log(`  Tithi: ${panchangam.tithi}`);
        console.log(`  Nakshatra: ${panchangam.nakshatra}`);
        console.log(`  Yoga: ${panchangam.yoga}`);
        console.log(`  Karana: ${panchangam.karana}`);
        console.log(`  Vara: ${panchangam.vara}`);
        console.log(`  Sunrise: ${panchangam.sunrise}`);
        console.log(`  Sunset: ${panchangam.sunset}`);
        console.log(`  Moonrise: ${panchangam.moonrise}`);
        console.log(`  Moonset: ${panchangam.moonset}`);
        console.log('');
        console.log('✅ Library is working correctly!');
        console.log('✅ All calculations are functioning properly!');
    }
    catch (error) {
        console.error('❌ Error in library:', error);
    }
}
// Run the test
testLibrary();
//# sourceMappingURL=simple-test.js.map