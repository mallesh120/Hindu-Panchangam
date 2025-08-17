"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nakshatraNames = exports.tithiNames = exports.yogaNames = exports.karanaNames = exports.getPanchangamDetails = exports.getPanchangam = exports.SearchRiseSet = exports.Ecliptic = exports.GeoVector = exports.Body = exports.Observer = void 0;
// src/index.ts
const astronomy_engine_1 = require("astronomy-engine");
Object.defineProperty(exports, "Observer", { enumerable: true, get: function () { return astronomy_engine_1.Observer; } });
Object.defineProperty(exports, "Body", { enumerable: true, get: function () { return astronomy_engine_1.Body; } });
Object.defineProperty(exports, "GeoVector", { enumerable: true, get: function () { return astronomy_engine_1.GeoVector; } });
Object.defineProperty(exports, "Ecliptic", { enumerable: true, get: function () { return astronomy_engine_1.Ecliptic; } });
Object.defineProperty(exports, "SearchRiseSet", { enumerable: true, get: function () { return astronomy_engine_1.SearchRiseSet; } });
// Main exports for the panchangam-js package
var panchangam_1 = require("./panchangam");
Object.defineProperty(exports, "getPanchangam", { enumerable: true, get: function () { return panchangam_1.getPanchangam; } });
Object.defineProperty(exports, "getPanchangamDetails", { enumerable: true, get: function () { return panchangam_1.getPanchangamDetails; } });
// Re-export constants
var panchangam_2 = require("./panchangam");
Object.defineProperty(exports, "karanaNames", { enumerable: true, get: function () { return panchangam_2.karanaNames; } });
Object.defineProperty(exports, "yogaNames", { enumerable: true, get: function () { return panchangam_2.yogaNames; } });
Object.defineProperty(exports, "tithiNames", { enumerable: true, get: function () { return panchangam_2.tithiNames; } });
Object.defineProperty(exports, "nakshatraNames", { enumerable: true, get: function () { return panchangam_2.nakshatraNames; } });
//# sourceMappingURL=index.js.map