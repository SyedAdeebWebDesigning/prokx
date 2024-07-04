"use server";

import User from "../database/models/User.model";
import { connectToDatabase } from "../database";

export interface createUserProps {
	clerkId: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	photo: string;
	hasProfileCompleted: boolean;
	address?: {
		street: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
	};
}

export const createUser = async (user: createUserProps) => {
	try {
		await connectToDatabase();

		const newUser = await User.create(user);
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		console.log(error);
	}
};
