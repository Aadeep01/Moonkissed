import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IBirthChart extends Document {
	name: string;
	birthDate: Date;
	birthTime: string;
	birthPlace: string;
	latitude: number;
	longitude: number;
	sunSign: string;
	moonSign: string;
	risingSign: string;
	createdAt: Date;
}

const BirthChartSchema: Schema<IBirthChart> = new Schema({
	name: { type: String, required: true },
	birthDate: { type: Date, required: true },
	birthTime: { type: String, required: true },
	birthPlace: { type: String, required: true },
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
	sunSign: { type: String, required: true },
	moonSign: { type: String, required: true },
	risingSign: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Avoid re-compiling the model in development (Hot Reloading)
const BirthChart: Model<IBirthChart> =
	mongoose.models.BirthChart || mongoose.model<IBirthChart>("BirthChart", BirthChartSchema);

export default BirthChart;
