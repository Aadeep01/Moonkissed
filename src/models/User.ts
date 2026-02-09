import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IUser extends Document {
	email: string;
	password?: string;
	name: string;
	image?: string;
	createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	image: { type: String },
	createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
