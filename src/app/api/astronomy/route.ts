import {
	type AstroTime,
	Body,
	Equator,
	GeoVector,
	Horizon,
	Illumination,
	MakeTime,
	MoonPhase,
	Observer,
	SearchGlobalSolarEclipse,
	SearchLunarEclipse,
	SiderealTime,
	type Vector,
} from "astronomy-engine";
import { NextResponse } from "next/server";

interface PlanetData {
	name: string;
	symbol: string;
	longitude: number;
	latitude: number;
	distance: number;
	speed: number;
	isRetrograde: boolean;
	zodiacSign: string;
	zodiacDegree: number;
}

interface MoonPhaseData {
	phase: number;
	phaseName: string;
	illumination: number;
	age: number;
}

interface AstronomicalEvent {
	type: string;
	description: string;
	date: string;
}

interface ExactAstronomyResult {
	date: string;
	planets: PlanetData[];
	moonPhase: MoonPhaseData;
	events: AstronomicalEvent[];
}

const PLANET_CONFIG = [
	{ name: "Sun", symbol: "☉", body: Body.Sun },
	{ name: "Moon", symbol: "☽", body: Body.Moon },
	{ name: "Mercury", symbol: "☿", body: Body.Mercury },
	{ name: "Venus", symbol: "♀", body: Body.Venus },
	{ name: "Mars", symbol: "♂", body: Body.Mars },
	{ name: "Jupiter", symbol: "♃", body: Body.Jupiter },
	{ name: "Saturn", symbol: "♄", body: Body.Saturn },
	{ name: "Uranus", symbol: "♅", body: Body.Uranus },
	{ name: "Neptune", symbol: "♆", body: Body.Neptune },
	{ name: "Pluto", symbol: "♇", body: Body.Pluto },
];

const ZODIAC_SIGNS = [
	{ name: "Aries", symbol: "♈︎", start: 0 },
	{ name: "Taurus", symbol: "♉︎", start: 30 },
	{ name: "Gemini", symbol: "♊︎", start: 60 },
	{ name: "Cancer", symbol: "♋︎", start: 90 },
	{ name: "Leo", symbol: "♌︎", start: 120 },
	{ name: "Virgo", symbol: "♍︎", start: 150 },
	{ name: "Libra", symbol: "♎︎", start: 180 },
	{ name: "Scorpio", symbol: "♏︎", start: 210 },
	{ name: "Sagittarius", symbol: "♐︎", start: 240 },
	{ name: "Capricorn", symbol: "♑︎", start: 270 },
	{ name: "Aquarius", symbol: "♒︎", start: 300 },
	{ name: "Pisces", symbol: "♓︎", start: 330 },
];

function vectorToEcliptic(vector: Vector): { longitude: number; latitude: number } {
	const x = vector.x;
	const y = vector.y;
	const z = vector.z;
	const r = Math.sqrt(x * x + y * y + z * z);

	let longitude = (Math.atan2(y, x) * 180) / Math.PI;
	if (longitude < 0) longitude += 360;

	const latitude = (Math.asin(z / r) * 180) / Math.PI;

	return { longitude, latitude };
}

function getZodiacInfo(longitude: number): { sign: string; degree: number } {
	const signIndex = Math.floor(longitude / 30) % 12;
	const degree = longitude % 30;
	return { sign: ZODIAC_SIGNS[signIndex]?.name || "Aries", degree };
}

function getMoonPhaseInfo(phase: number): { name: string; illumination: number } {
	// Phase is 0-360 where 0=new, 90=first quarter, 180=full, 270=last quarter
	if (phase < 45 || phase > 315) return { name: "New Moon", illumination: 0 };
	if (phase < 90) return { name: "Waxing Crescent", illumination: ((phase - 45) / 45) * 50 };
	if (phase < 135) return { name: "First Quarter", illumination: 50 };
	if (phase < 180) return { name: "Waxing Gibbous", illumination: 50 + ((phase - 135) / 45) * 50 };
	if (phase < 225) return { name: "Full Moon", illumination: 100 };
	if (phase < 270) return { name: "Waning Gibbous", illumination: 100 - ((phase - 225) / 45) * 50 };
	if (phase < 315) return { name: "Last Quarter", illumination: 50 };
	return { name: "New Moon", illumination: 0 };
}

function calculatePlanetSpeed(body: Body, time: AstroTime): number {
	// Calculate speed by comparing position 1 hour later
	const dt = 1 / 24; // 1 hour in days
	const pos1 = vectorToEcliptic(GeoVector(body, time, true));
	const time2 = MakeTime(time.ut + dt);
	const pos2 = vectorToEcliptic(GeoVector(body, time2, true));

	let diff = pos2.longitude - pos1.longitude;
	// Handle wrap-around
	if (diff > 180) diff -= 360;
	if (diff < -180) diff += 360;

	return diff / dt; // degrees per day
}

function isRetrograde(body: Body, time: AstroTime): boolean {
	if (body === Body.Sun || body === Body.Moon) return false;
	const speed = calculatePlanetSpeed(body, time);
	return speed < 0;
}

function checkAstronomicalEvents(date: Date): AstronomicalEvent[] {
	const events: AstronomicalEvent[] = [];
	const time = MakeTime(date);

	// Check for lunar eclipse within 24 hours
	try {
		const lunarEclipse = SearchLunarEclipse(date);
		if (lunarEclipse) {
			const hoursDiff = Math.abs(lunarEclipse.peak.ut - time.ut) * 24;
			if (hoursDiff < 24) {
				events.push({
					type: "Eclipse",
					description: `Lunar Eclipse (${lunarEclipse.kind})`,
					date: new Date(lunarEclipse.peak.date).toISOString(),
				});
			}
		}
	} catch {
		// No eclipse found
	}

	// Check for solar eclipse within 24 hours
	try {
		const solarEclipse = SearchGlobalSolarEclipse(date);
		if (solarEclipse) {
			const hoursDiff = Math.abs(solarEclipse.peak.ut - time.ut) * 24;
			if (hoursDiff < 24) {
				events.push({
					type: "Eclipse",
					description: `Solar Eclipse (${solarEclipse.kind})`,
					date: new Date(solarEclipse.peak.date).toISOString(),
				});
			}
		}
	} catch {
		// No eclipse found
	}

	return events;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { targetDate, latitude, longitude } = body;

		if (!targetDate) {
			return NextResponse.json({ error: "Missing targetDate parameter" }, { status: 400 });
		}

		const date = new Date(targetDate);
		const time = MakeTime(date);

		// Calculate planet positions
		const planets: PlanetData[] = [];

		for (const config of PLANET_CONFIG) {
			try {
				const vector = GeoVector(config.body, time, true);
				const ecliptic = vectorToEcliptic(vector);
				const zodiacInfo = getZodiacInfo(ecliptic.longitude);
				const speed = calculatePlanetSpeed(config.body, time);

				planets.push({
					name: config.name,
					symbol: config.symbol,
					longitude: ecliptic.longitude,
					latitude: ecliptic.latitude,
					distance: vector.Length(),
					speed,
					isRetrograde: isRetrograde(config.body, time),
					zodiacSign: zodiacInfo.sign,
					zodiacDegree: zodiacInfo.degree,
				});
			} catch (err) {
				console.error(`Error calculating ${config.name}:`, err);
			}
		}

		// Calculate Moon phase
		const moonPhase = MoonPhase(time);
		const moonPhaseInfo = getMoonPhaseInfo(moonPhase);

		// Calculate moon illumination
		const moonIllum = Illumination(Body.Moon, time);

		// Check for astronomical events
		const events = checkAstronomicalEvents(date);

		// Calculate sidereal time if location provided
		if (latitude !== undefined && longitude !== undefined) {
			try {
				const observer = new Observer(latitude, longitude, 0);
				SiderealTime(time); // Calculate but don't need to store

				// Add rise/set times for major bodies
				const majorBodies = [1, 2, 3, 4] as const; // Moon, Mercury, Venus, Mars indices
				for (const idx of majorBodies) {
					const bodyConfig = PLANET_CONFIG[idx];
					if (!bodyConfig) continue;
					try {
						const equ = Equator(bodyConfig.body, time, observer, true, true);
						const hor = Horizon(time, observer, equ.ra, equ.dec, "normal");

						if (hor.altitude > -0.5 && hor.altitude < 0.5) {
							events.push({
								type: "Rise/Set",
								description: `${bodyConfig.name} at horizon (Alt: ${hor.altitude.toFixed(1)}°)`,
								date: date.toISOString(),
							});
						}
					} catch {
						// Body not visible
					}
				}
			} catch (err) {
				console.error("Error calculating local observations:", err);
			}
		}

		const result: ExactAstronomyResult = {
			date: date.toISOString(),
			planets,
			moonPhase: {
				phase: moonPhase,
				phaseName: moonPhaseInfo.name,
				illumination: moonIllum.phase_fraction * 100,
				age: (moonPhase / 360) * 29.53, // Approximate moon age in days
			},
			events,
		};

		return NextResponse.json(result);
	} catch (error) {
		console.error("Astronomy calculation error:", error);
		return NextResponse.json({ error: "Failed to calculate astronomical data" }, { status: 500 });
	}
}
