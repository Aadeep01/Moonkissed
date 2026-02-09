import { Body, EclipticLongitude, MakeTime, SiderealTime, SunPosition } from "astronomy-engine";

const ZODIAC_SIGNS = [
	"Aries",
	"Taurus",
	"Gemini",
	"Cancer",
	"Leo",
	"Virgo",
	"Libra",
	"Scorpio",
	"Sagittarius",
	"Capricorn",
	"Aquarius",
	"Pisces",
];

function getZodiacSign(longitude: number): string {
	// Normalize longitude to 0-360
	const normalized = ((longitude % 360) + 360) % 360;
	const signIndex = Math.floor(normalized / 30);
	return ZODIAC_SIGNS[signIndex] || "Aries";
}

export interface AstrologyResult {
	sunSign: string;
	sunLong: number;
	moonSign: string;
	moonLong: number;
	risingSign: string;
	ascendantLong: number;
	mcSign: string;
	mcLong: number;
	mercurySign: string;
	mercuryLong: number;
	venusSign: string;
	venusLong: number;
	marsSign: string;
	marsLong: number;
	houses: number[]; // Ecliptic longitudes of the 12 house cusps
}

/**
 * Calculates Sun, Moon, Rising, personal planets, and house cusps.
 * @param date The birth date and time.
 * @param latitude Geographic latitude.
 * @param longitude Geographic longitude.
 */
export function calculateSigns(date: Date, latitude: number, longitude: number): AstrologyResult {
	const astroTime = MakeTime(date);

	// 1. Sun Sign
	const sunEcliptic = SunPosition(astroTime);
	const sunLong = sunEcliptic.elon;
	const sunSign = getZodiacSign(sunLong);

	// 2. Moon Sign
	const moonLong = EclipticLongitude(Body.Moon, astroTime);
	const moonSign = getZodiacSign(moonLong);

	// 3. Mercury Sign
	const mercuryLong = EclipticLongitude(Body.Mercury, astroTime);
	const mercurySign = getZodiacSign(mercuryLong);

	// 4. Venus Sign
	const venusLong = EclipticLongitude(Body.Venus, astroTime);
	const venusSign = getZodiacSign(venusLong);

	// 5. Mars Sign
	const marsLong = EclipticLongitude(Body.Mars, astroTime);
	const marsSign = getZodiacSign(marsLong);

	// 6. Angles and Sidereal Time
	const gstHours = SiderealTime(astroTime);
	const lstHours = (gstHours + longitude / 15.0 + 24.0) % 24.0;
	const lstRadians = (lstHours * Math.PI) / 12.0;

	// Obliquity of the ecliptic
	const t = astroTime.tt / 36525.0; // Centuries since J2000
	const e = (23.4392911 - (46.815 * t) / 3600.0) * (Math.PI / 180.0);
	const latRad = (latitude * Math.PI) / 180.0;

	// Ascendant formula
	const ascNum = -Math.cos(lstRadians);
	const ascDen = Math.sin(lstRadians) * Math.cos(e) + Math.tan(latRad) * Math.sin(e);
	const ascendantRad = Math.atan2(ascNum, ascDen);
	let ascendantLong = (ascendantRad * 180.0) / Math.PI;
	ascendantLong = (ascendantLong + 360.0) % 360.0;
	const risingSign = getZodiacSign(ascendantLong);

	// Midheaven (MC) formula
	const mcRad = Math.atan2(Math.sin(lstRadians), Math.cos(lstRadians) * Math.cos(e));
	let mcLong = (mcRad * 180.0) / Math.PI;
	mcLong = (mcLong + 360.0) % 360.0;
	const mcSign = getZodiacSign(mcLong);

	// Simple House System: Equal House (starting from Ascendant)
	// For high-end UI, this is very predictable and clean.
	const houses = Array.from({ length: 12 }, (_, i) => (ascendantLong + i * 30) % 360);

	return {
		sunSign,
		sunLong,
		moonSign,
		moonLong,
		risingSign,
		ascendantLong,
		mcSign,
		mcLong,
		mercurySign,
		mercuryLong,
		venusSign,
		venusLong,
		marsSign,
		marsLong,
		houses,
	};
}
