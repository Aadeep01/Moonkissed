import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IBirthChart extends Document {
	name: string;
	birthDate: Date;
	birthTime: string;
	birthPlace: string;
	latitude: number;
	longitude: number;
	sunSign: string;
	sunLong?: number;
	moonSign: string;
	moonLong?: number;
	risingSign: string;
	ascendantLong?: number;
	mcSign?: string;
	mcLong?: number;
	mercurySign: string;
	mercuryLong?: number;
	venusSign: string;
	venusLong?: number;
	marsSign: string;
	marsLong?: number;
	houses?: number[];
	userId?: string;
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
	sunLong: { type: Number, required: true },
	moonSign: { type: String, required: true },
	moonLong: { type: Number, required: true },
	risingSign: { type: String, required: true },
	ascendantLong: { type: Number, required: true },
	mcSign: { type: String, required: true },
	mcLong: { type: Number, required: true },
	mercurySign: { type: String, required: true },
	mercuryLong: { type: Number, required: true },
	venusSign: { type: String, required: true },
	venusLong: { type: Number, required: true },
	marsSign: { type: String, required: true },
	marsLong: { type: Number, required: true },
	houses: [{ type: Number, required: true }],
	userId: { type: String },
	createdAt: { type: Date, default: Date.now },
});

// Avoid re-compiling the model in development (Hot Reloading)
const BirthChart: Model<IBirthChart> =
	mongoose.models.BirthChart || mongoose.model<IBirthChart>("BirthChart", BirthChartSchema);

export default BirthChart;
