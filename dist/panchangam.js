"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nakshatraNames = exports.tithiNames = exports.yogaNames = exports.karanaNames = void 0;
exports.getPanchangam = getPanchangam;
exports.getPanchangamDetails = getPanchangamDetails;
const astronomy_engine_1 = require("astronomy-engine");
const repeatingKaranaNames = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"
];
const fixedKaranaNames = [
    "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];
exports.karanaNames = [...repeatingKaranaNames, ...fixedKaranaNames];
exports.yogaNames = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
    "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha",
    "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];
exports.tithiNames = [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];
exports.nakshatraNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];
function getTithi(sunLon, moonLon) {
    let longitudeDifference = moonLon - sunLon;
    if (longitudeDifference < 0) {
        longitudeDifference += 360;
    }
    return Math.floor(longitudeDifference / 12);
}
function getNakshatra(moonLon) {
    return Math.floor(moonLon / (13 + 1 / 3));
}
function getYoga(sunLon, moonLon) {
    const totalLongitude = sunLon + moonLon;
    return Math.floor(totalLongitude / (13 + 1 / 3)) % 27;
}
function getKarana(sunLon, moonLon) {
    let longitudeDifference = moonLon - sunLon;
    if (longitudeDifference < 0) {
        longitudeDifference += 360;
    }
    const karanaIndexAbs = Math.floor(longitudeDifference / 6);
    if (karanaIndexAbs === 0) {
        return "Kimstughna";
    }
    if (karanaIndexAbs === 57) {
        return "Shakuni";
    }
    if (karanaIndexAbs === 58) {
        return "Chatushpada";
    }
    if (karanaIndexAbs === 59) {
        return "Naga";
    }
    const repeatingIndex = (karanaIndexAbs - 1) % 7;
    return repeatingKaranaNames[repeatingIndex];
}
function getVara(date) {
    return date.getDay();
}
function getSunrise(date, observer) {
    const time = (0, astronomy_engine_1.SearchRiseSet)(astronomy_engine_1.Body.Sun, observer, 1, date, 1);
    return time?.date || null;
}
function getSunset(date, observer) {
    const time = (0, astronomy_engine_1.SearchRiseSet)(astronomy_engine_1.Body.Sun, observer, -1, date, 1);
    return time?.date || null;
}
function getMoonrise(date, observer) {
    const time = (0, astronomy_engine_1.SearchRiseSet)(astronomy_engine_1.Body.Moon, observer, 1, date, 1);
    return time?.date || null;
}
function getMoonset(date, observer) {
    const time = (0, astronomy_engine_1.SearchRiseSet)(astronomy_engine_1.Body.Moon, observer, -1, date, 1);
    return time?.date || null;
}
/**
 * A generic search function to find the time when a function f(t) crosses zero.
 * It uses a binary search approach.
 */
function search(f, startDate) {
    let a = startDate;
    let b = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000); // Look ahead 2 days
    let fa = f(a);
    let fb = f(b);
    if (fa * fb >= 0) {
        // We need the function to cross zero in the interval. 
        // If not, we might not find a root.
        // This can happen if a tithi/nakshatra doesn't end within the next 2 days, which is rare.
        return null;
    }
    for (let i = 0; i < 20; i++) { // 20 iterations are enough for high precision
        const m = new Date((a.getTime() + b.getTime()) / 2);
        const fm = f(m);
        if (fm * fa < 0) {
            b = m;
            fb = fm;
        }
        else {
            a = m;
            fa = fm;
        }
    }
    return a;
}
function findNakshatraStart(date) {
    const moonLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true)).elon;
    const currentNakshatraIndex = Math.floor(moonLonInitial / (13 + 1 / 3));
    const startNakshatraLongitude = currentNakshatraIndex * (13 + 1 / 3);
    const targetLon = startNakshatraLongitude % 360;
    const nakshatraFunc = (d) => {
        let moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
        // Handle the 360->0 wrap-around for the search.
        if (moonLon > targetLon + 180) {
            moonLon -= 360;
        }
        return moonLon - targetLon;
    };
    // A nakshatra lasts about a day. Searching from 25 hours before should be safe.
    const searchStartDate = new Date(date.getTime() - 25 * 60 * 60 * 1000);
    return search(nakshatraFunc, searchStartDate);
}
function findNakshatraEnd(date) {
    const moonLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true)).elon;
    const currentNakshatra = Math.floor(moonLonInitial / (13 + 1 / 3));
    const nextNakshatraLongitude = (currentNakshatra + 1) * (13 + 1 / 3);
    const targetLon = nextNakshatraLongitude % 360;
    const nakshatraFunc = (d) => {
        let moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
        // Handle the 360->0 wrap-around
        if (moonLon < targetLon - 180) {
            moonLon += 360;
        }
        return moonLon - targetLon;
    };
    return search(nakshatraFunc, date);
}
function findTithiStart(date) {
    const sunLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, date, true)).elon;
    const moonLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true)).elon;
    let diffInitial = moonLonInitial - sunLonInitial;
    if (diffInitial < 0)
        diffInitial += 360;
    const currentTithi = Math.floor(diffInitial / 12);
    const startTithiAngle = currentTithi * 12;
    const targetAngle = startTithiAngle % 360;
    const tithiFunc = (d) => {
        const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
        const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
        let diff = moonLon - sunLon;
        if (diff < 0)
            diff += 360;
        // Handle the 360->0 wrap-around for search.
        if (diff > targetAngle + 180) {
            diff -= 360;
        }
        return diff - targetAngle;
    };
    // A tithi is slightly less than a day. Searching from 25h before is safe.
    const searchStartDate = new Date(date.getTime() - 25 * 60 * 60 * 1000);
    return search(tithiFunc, searchStartDate);
}
function findTithiEnd(date) {
    const sunLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, date, true)).elon;
    const moonLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true)).elon;
    let diffInitial = moonLonInitial - sunLonInitial;
    if (diffInitial < 0)
        diffInitial += 360;
    const currentTithi = Math.floor(diffInitial / 12);
    const nextTithiAngle = (currentTithi + 1) * 12;
    const targetAngle = nextTithiAngle % 360;
    const tithiFunc = (d) => {
        const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
        const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
        let diff = moonLon - sunLon;
        if (diff < 0)
            diff += 360;
        if (diff < targetAngle - 180) {
            diff += 360;
        }
        return diff - targetAngle;
    };
    return search(tithiFunc, date);
}
function findYogaEnd(date) {
    const sunLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, date, true)).elon;
    const moonLonInitial = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true)).elon;
    const totalLongitudeInitial = sunLonInitial + moonLonInitial;
    const yogaWidth = 360 / 27; // 13 degrees 20 minutes
    const currentYogaTotalIndex = Math.floor(totalLongitudeInitial / yogaWidth);
    const nextYogaBoundary = (currentYogaTotalIndex + 1) * yogaWidth;
    const yogaFunc = (d) => {
        const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
        const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
        let totalLon = sunLon + moonLon;
        // If totalLon is much smaller than our target, it means one of the
        // components (likely the moon) has wrapped around from 360 to 0.
        // We add 360 to make the value monotonic for the search function.
        if (totalLon < nextYogaBoundary - 270) {
            totalLon += 360;
        }
        return totalLon - nextYogaBoundary;
    };
    return search(yogaFunc, date);
}
function calculateRahuKalam(sunrise, sunset, vara) {
    if (!sunrise || !sunset) {
        return null;
    }
    const daylightMillis = sunset.getTime() - sunrise.getTime();
    const portionMillis = daylightMillis / 8;
    const rahuKalamPortionIndex = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const portionIndex = rahuKalamPortionIndex[vara];
    const startMillis = sunrise.getTime() + (portionIndex - 1) * portionMillis;
    const endMillis = sunrise.getTime() + portionIndex * portionMillis;
    return {
        start: new Date(startMillis),
        end: new Date(endMillis)
    };
}
/**
 * Find all Karana transitions (end times and names) between startDate and endDate (typically sunrise to next sunrise)
 */
function findKaranaTransitions(startDate, endDate) {
    const transitions = [];
    let current = new Date(startDate);
    let lastKarana = getKarana((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
    while (current < endDate) {
        // Find next Karana end
        const nextKaranaEnd = (() => {
            // Karana changes every 6 degrees of moon-sun difference
            const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon;
            const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon;
            let diff = moonLon - sunLon;
            if (diff < 0)
                diff += 360;
            const karanaIndexAbs = Math.floor(diff / 6);
            const nextKaranaAngle = (karanaIndexAbs + 1) * 6;
            const targetAngle = nextKaranaAngle % 360;
            const karanaFunc = (d) => {
                const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
                const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
                let diff = moonLon - sunLon;
                if (diff < 0)
                    diff += 360;
                if (diff < targetAngle - 180)
                    diff += 360;
                return diff - targetAngle;
            };
            return search(karanaFunc, current);
        })();
        if (!nextKaranaEnd || nextKaranaEnd > endDate) {
            // Last Karana for the day
            transitions.push({ name: lastKarana, endTime: endDate });
            break;
        }
        else {
            transitions.push({ name: lastKarana, endTime: nextKaranaEnd });
            current = new Date(nextKaranaEnd.getTime() + 60 * 1000); // move 1 min ahead to avoid infinite loop
            lastKarana = getKarana((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
        }
    }
    return transitions;
}
function findTithiTransitions(startDate, endDate) {
    const transitions = [];
    let current = new Date(startDate);
    let lastTithi = getTithi((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
    while (current < endDate) {
        const nextTithiEnd = (() => {
            const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon;
            const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon;
            let diff = moonLon - sunLon;
            if (diff < 0)
                diff += 360;
            const tithiIndex = Math.floor(diff / 12);
            const nextTithiAngle = (tithiIndex + 1) * 12;
            const targetAngle = nextTithiAngle % 360;
            const tithiFunc = (d) => {
                const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
                const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
                let diff = moonLon - sunLon;
                if (diff < 0)
                    diff += 360;
                if (diff < targetAngle - 180)
                    diff += 360;
                return diff - targetAngle;
            };
            return search(tithiFunc, current);
        })();
        if (!nextTithiEnd || nextTithiEnd > endDate) {
            transitions.push({ index: lastTithi, name: exports.tithiNames[lastTithi] || String(lastTithi), endTime: endDate });
            break;
        }
        else {
            transitions.push({ index: lastTithi, name: exports.tithiNames[lastTithi] || String(lastTithi), endTime: nextTithiEnd });
            current = new Date(nextTithiEnd.getTime() + 60 * 1000);
            lastTithi = getTithi((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
        }
    }
    return transitions;
}
function findNakshatraTransitions(startDate, endDate) {
    const transitions = [];
    let current = new Date(startDate);
    let lastNakshatra = getNakshatra((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
    while (current < endDate) {
        const nextNakshatraEnd = (() => {
            const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon;
            const nakshatraIndex = Math.floor(moonLon / (13 + 1 / 3));
            const nextNakshatraLongitude = (nakshatraIndex + 1) * (13 + 1 / 3);
            const targetLon = nextNakshatraLongitude % 360;
            const nakshatraFunc = (d) => {
                let moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
                if (moonLon < targetLon - 180)
                    moonLon += 360;
                return moonLon - targetLon;
            };
            return search(nakshatraFunc, current);
        })();
        if (!nextNakshatraEnd || nextNakshatraEnd > endDate) {
            transitions.push({ index: lastNakshatra, name: exports.nakshatraNames[lastNakshatra] || String(lastNakshatra), endTime: endDate });
            break;
        }
        else {
            transitions.push({ index: lastNakshatra, name: exports.nakshatraNames[lastNakshatra] || String(lastNakshatra), endTime: nextNakshatraEnd });
            current = new Date(nextNakshatraEnd.getTime() + 60 * 1000);
            lastNakshatra = getNakshatra((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
        }
    }
    return transitions;
}
function findYogaTransitions(startDate, endDate) {
    const transitions = [];
    let current = new Date(startDate);
    let lastYoga = getYoga((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
    while (current < endDate) {
        const nextYogaEnd = (() => {
            const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon;
            const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon;
            const totalLongitude = sunLon + moonLon;
            const yogaWidth = 360 / 27;
            const yogaIndex = Math.floor(totalLongitude / yogaWidth);
            const nextYogaBoundary = (yogaIndex + 1) * yogaWidth;
            const yogaFunc = (d) => {
                const sunLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, d, true)).elon;
                const moonLon = (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, d, true)).elon;
                let totalLon = sunLon + moonLon;
                if (totalLon < nextYogaBoundary - 270)
                    totalLon += 360;
                return totalLon - nextYogaBoundary;
            };
            return search(yogaFunc, current);
        })();
        if (!nextYogaEnd || nextYogaEnd > endDate) {
            transitions.push({ index: lastYoga, name: exports.yogaNames[lastYoga] || String(lastYoga), endTime: endDate });
            break;
        }
        else {
            transitions.push({ index: lastYoga, name: exports.yogaNames[lastYoga] || String(lastYoga), endTime: nextYogaEnd });
            current = new Date(nextYogaEnd.getTime() + 60 * 1000);
            lastYoga = getYoga((0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, current, true)).elon, (0, astronomy_engine_1.Ecliptic)((0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, current, true)).elon);
        }
    }
    return transitions;
}
function getPanchangam(date, observer) {
    const sunVector = (0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Sun, date, true);
    const moonVector = (0, astronomy_engine_1.GeoVector)(astronomy_engine_1.Body.Moon, date, true);
    const sunEcliptic = (0, astronomy_engine_1.Ecliptic)(sunVector);
    const moonEcliptic = (0, astronomy_engine_1.Ecliptic)(moonVector);
    const sunrise = getSunrise(date, observer);
    const sunset = getSunset(date, observer);
    const moonrise = getMoonrise(date, observer);
    const moonset = getMoonset(date, observer);
    const nakshatraStartTime = findNakshatraStart(date);
    const nakshatraEndTime = findNakshatraEnd(date);
    const tithiStartTime = findTithiStart(date);
    const tithiEndTime = findTithiEnd(date);
    const yogaEndTime = findYogaEnd(date);
    const rahuKalam = (sunrise && sunset) ? calculateRahuKalam(sunrise, sunset, getVara(date)) : null;
    // For Karana transitions, use sunrise to next day's sunrise
    let nextSunrise = null;
    if (sunrise) {
        const nextDay = new Date(sunrise.getTime());
        nextDay.setDate(nextDay.getDate() + 1);
        nextSunrise = getSunrise(nextDay, observer);
    }
    const karanaTransitions = (sunrise && nextSunrise)
        ? findKaranaTransitions(sunrise, nextSunrise)
        : [];
    const tithiTransitions = (sunrise && nextSunrise)
        ? findTithiTransitions(sunrise, nextSunrise)
        : [];
    const nakshatraTransitions = (sunrise && nextSunrise)
        ? findNakshatraTransitions(sunrise, nextSunrise)
        : [];
    const yogaTransitions = (sunrise && nextSunrise)
        ? findYogaTransitions(sunrise, nextSunrise)
        : [];
    return {
        tithi: getTithi(sunEcliptic.elon, moonEcliptic.elon),
        nakshatra: getNakshatra(moonEcliptic.elon),
        yoga: getYoga(sunEcliptic.elon, moonEcliptic.elon),
        karana: getKarana(sunEcliptic.elon, moonEcliptic.elon),
        vara: getVara(date),
        sunrise,
        sunset,
        moonrise,
        moonset,
        nakshatraStartTime,
        nakshatraEndTime,
        tithiStartTime,
        tithiEndTime,
        yogaEndTime,
        rahuKalamStart: rahuKalam?.start || null,
        rahuKalamEnd: rahuKalam?.end || null,
        karanaTransitions,
        tithiTransitions,
        nakshatraTransitions,
        yogaTransitions,
    };
}
function getPanchangamDetails(date, observer) {
    const panchangam = getPanchangam(date, observer);
    const sunrise = getSunrise(date, observer);
    const sunset = getSunset(date, observer);
    const nakshatraEndTime = findNakshatraEnd(date);
    return {
        ...panchangam,
        sunrise,
        sunset,
        nakshatraEndTime,
    };
}
//# sourceMappingURL=panchangam.js.map