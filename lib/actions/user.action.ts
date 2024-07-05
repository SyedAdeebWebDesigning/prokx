"use server";

import User, { User as UserType } from "../database/models/User.model";
import { connectToDatabase } from "../database";

export interface createUserProps {
	clerkId: string;
	email: string;
	username: string;
	firstName?: string;
	lastName?: string;
	photo: string;
	hasProfileCompleted: boolean;
	isAdmin: boolean;
}

export const createUser = async (user: createUserProps) => {
	try {
		await connectToDatabase();

		const newUser = await User.create(user);
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		console.error("Error creating user:", error);
	}
};
