import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */

// Use a unique symbol to store the mongoose connection on globalThis
// to avoid any potential namespace collisions.
const cachedConnectionKey = Symbol.for("mongoose.connection");

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

// Access the global variable using the symbol
const globalWithMongoose = globalThis as typeof globalThis & {
	[cachedConnectionKey]: MongooseCache;
};

// Initialize the cache if it doesn't exist
if (!globalWithMongoose[cachedConnectionKey]) {
	globalWithMongoose[cachedConnectionKey] = { conn: null, promise: null };
}

const cached = globalWithMongoose[cachedConnectionKey];

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
