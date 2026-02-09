import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IHoroscope extends Document {
	sign: string;
	date: string; // YYYY-MM-DD
	content: string;
	createdAt: Date;
}

const HoroscopeSchema: Schema<IHoroscope> = new Schema({
	sign: { type: String, required: true },
	date: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 86400 * 2 }, // Expire after 2 days
});

// Compound index to ensure uniqueness per sign per day
HoroscopeSchema.index({ sign: 1, date: 1 }, { unique: true });

const Horoscope: Model<IHoroscope> =
	mongoose.models.Horoscope || mongoose.model<IHoroscope>("Horoscope", HoroscopeSchema);

export default Horoscope;
