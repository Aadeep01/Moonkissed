import { Body, EclipticLongitude, MakeTime, SiderealTime } from "astronomy-engine";

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
	moonSign: string;
	risingSign: string;
}

/**
 * Calculates Sun, Moon, and Rising signs.
 * @param date The birth date and time.
 * @param latitude Geographic latitude.
 * @param longitude Geographic longitude.
 */
export function calculateSigns(date: Date, latitude: number, longitude: number): AstrologyResult {
	const astroTime = MakeTime(date);

	// 1. Sun Sign
	const sunLong = EclipticLongitude(Body.Sun, astroTime);
	const sunSign = getZodiacSign(sunLong);

	// 2. Moon Sign
	const moonLong = EclipticLongitude(Body.Moon, astroTime);
	const moonSign = getZodiacSign(moonLong);

	// 3. Rising Sign (Ascendant)
	// Greenwich Apparent Sidereal Time in hours
	const gstHours = SiderealTime(astroTime);

	// Local Sidereal Time (LST)
	// LST = GST + Longitude / 15
	const lstHours = (gstHours + longitude / 15.0 + 24.0) % 24.0;
	const lstRadians = (lstHours * Math.PI) / 12.0;

	// Obliquity of the ecliptic (approximate for the date)
	const t = astroTime.tt / 36525.0; // Centuries since J2000
	const e = (23.4392911 - (46.815 * t) / 3600.0) * (Math.PI / 180.0);

	const latRad = (latitude * Math.PI) / 180.0;

	// Ascendant formula: tan(Asc) = -cos(LST) / (sin(LST)*cos(e) + tan(lat)*sin(e))
	const numerator = -Math.cos(lstRadians);
	const denominator = Math.sin(lstRadians) * Math.cos(e) + Math.tan(latRad) * Math.sin(e);

	const ascendantRad = Math.atan2(numerator, denominator);
	let ascendantDeg = (ascendantRad * 180.0) / Math.PI;

	// Normalize to 0-360
	ascendantDeg = (ascendantDeg + 360.0) % 360.0;

	const risingSign = getZodiacSign(ascendantDeg);

	return {
		sunSign,
		moonSign,
		risingSign,
	};
}
