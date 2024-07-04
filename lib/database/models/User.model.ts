import { Schema, model, models, Document } from "mongoose";

// Define Address interface
interface Address {
	street: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
}

// Define User interface extending mongoose.Document for type safety
interface User extends Document {
	clerkId: string;
	email: string;
	username: string;
	firstName?: string;
	lastName?: string;
	photo: string;
	hasProfileCompleted: boolean;
	address?: Address;
}

// Define Address schema
const AddressSchema = new Schema<Address>({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	postalCode: { type: String, required: true },
});

// Define User schema and add Address schema as a subdocument
const UserSchema = new Schema<User>({
	clerkId: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	firstName: { type: String },
	lastName: { type: String },
	photo: { type: String, required: true },
	hasProfileCompleted: { type: Boolean, required: true, default: false },
	address: { type: AddressSchema },
});

// Define the User model with the User interface
const User = models.User || model<User>("User", UserSchema);

export default User;
export type { User, Address };
