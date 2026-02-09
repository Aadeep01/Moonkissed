import { Body, GeoVector, type Vector } from "astronomy-engine";
import { NextResponse } from "next/server";

// Planet mapping to astronomy-engine Body enum
const PLANET_BODIES: Record<string, Body> = {
	Sun: Body.Sun,
	Moon: Body.Moon,
	Mercury: Body.Mercury,
	Venus: Body.Venus,
	Mars: Body.Mars,
	Jupiter: Body.Jupiter,
	Saturn: Body.Saturn,
	Uranus: Body.Uranus,
	Neptune: Body.Neptune,
	Pluto: Body.Pluto,
};

interface PlanetPosition {
	name: string;
	longitude: number;
	latitude: number;
	distance: number;
}

interface TransitAspect {
	transitingPlanet: string;
	natalPlanet: string;
	aspect: string;
	orb: number;
	transitingLongitude: number;
	natalLongitude: number;
}

// Calculate longitude from vector
function vectorToLongitude(vector: Vector): number {
	const x = vector.x;
	const y = vector.y;
	let longitude = (Math.atan2(y, x) * 180) / Math.PI;
	if (longitude < 0) longitude += 360;
	return longitude;
}

// Get planet position for a specific date
function getPlanetPosition(planetName: string, date: Date): PlanetPosition {
	const body = PLANET_BODIES[planetName];
	if (!body) throw new Error(`Unknown planet: ${planetName}`);

	const vector = GeoVector(body, date, true);

	return {
		name: planetName,
		longitude: vectorToLongitude(vector),
		latitude: 0,
		distance: vector.Length(),
	};
}

// Calculate aspects between two longitudes
function calculateAspect(long1: number, long2: number): { aspect: string | null; orb: number } {
	let diff = Math.abs(long1 - long2);
	if (diff > 180) diff = 360 - diff;

	const aspects = [
		{ name: "Conjunction", angle: 0, orb: 8 },
		{ name: "Sextile", angle: 60, orb: 6 },
		{ name: "Square", angle: 90, orb: 8 },
		{ name: "Trine", angle: 120, orb: 8 },
		{ name: "Opposition", angle: 180, orb: 8 },
	];

	for (const asp of aspects) {
		const orb = Math.abs(diff - asp.angle);
		if (orb <= asp.orb) {
			return { aspect: asp.name, orb };
		}
	}

	return { aspect: null, orb: diff };
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { natalPlanets, targetDate } = body;

		if (!natalPlanets || !targetDate) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}

		const date = new Date(targetDate);

		// Calculate positions for all planets at the target date
		const transitingPositions: PlanetPosition[] = [];
		for (const planetName of Object.keys(PLANET_BODIES)) {
			try {
				const pos = getPlanetPosition(planetName, date);
				transitingPositions.push(pos);
			} catch (err) {
				console.error(`Error calculating position for ${planetName}:`, err);
			}
		}

		// Calculate aspects between transiting and natal planets
		const transits: TransitAspect[] = [];
		for (const transiting of transitingPositions) {
			for (const natal of natalPlanets) {
				const { aspect, orb } = calculateAspect(transiting.longitude, natal.longitude);
				if (aspect) {
					transits.push({
						transitingPlanet: transiting.name,
						natalPlanet: natal.name,
						aspect,
						orb,
						transitingLongitude: transiting.longitude,
						natalLongitude: natal.longitude,
					});
				}
			}
		}

		// Sort by orb (tightest aspects first)
		transits.sort((a, b) => a.orb - b.orb);

		return NextResponse.json({
			transits,
			targetDate: date.toISOString(),
			transitingPositions,
		});
	} catch (error) {
		console.error("Transit calculation error:", error);
		return NextResponse.json({ error: "Failed to calculate transits" }, { status: 500 });
	}
}
