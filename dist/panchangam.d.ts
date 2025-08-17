import { Observer } from "astronomy-engine";
export interface KaranaTransition {
    name: string;
    endTime: Date;
}
export interface TithiTransition {
    index: number;
    name: string;
    endTime: Date;
}
export interface NakshatraTransition {
    index: number;
    name: string;
    endTime: Date;
}
export interface YogaTransition {
    index: number;
    name: string;
    endTime: Date;
}
export interface Panchangam {
    tithi: number;
    nakshatra: number;
    yoga: number;
    karana: string;
    vara: number;
    sunrise: Date | null;
    sunset: Date | null;
    moonrise: Date | null;
    moonset: Date | null;
    nakshatraStartTime: Date | null;
    nakshatraEndTime: Date | null;
    tithiStartTime: Date | null;
    tithiEndTime: Date | null;
    yogaEndTime: Date | null;
    rahuKalamStart: Date | null;
    rahuKalamEnd: Date | null;
    karanaTransitions: KaranaTransition[];
    tithiTransitions: TithiTransition[];
    nakshatraTransitions: NakshatraTransition[];
    yogaTransitions: YogaTransition[];
}
export interface PanchangamDetails extends Panchangam {
    sunrise: Date | null;
}
export declare const karanaNames: string[];
export declare const yogaNames: string[];
export declare const tithiNames: string[];
export declare const nakshatraNames: string[];
export declare function getPanchangam(date: Date, observer: Observer): Panchangam;
export declare function getPanchangamDetails(date: Date, observer: Observer): PanchangamDetails;
//# sourceMappingURL=panchangam.d.ts.map