"use server";

import User from "../database/models/User.model";
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
export interface UpdateUserProps {
	email?: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	photo?: string;
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

export const updateUser = async (
	clerkId: string,
	updateProps: UpdateUserProps
) => {
	try {
		await connectToDatabase();

		const updatedUser = await User.findOneAndUpdate({ clerkId }, updateProps, {
			new: true, // return the updated document
			runValidators: true, // validate the updates against the schema
		});

		if (!updatedUser) {
			throw new Error("User not found");
		}

		return JSON.parse(JSON.stringify(updatedUser));
	} catch (error) {
		console.error("Error updating user:", error);
	}
};

export const deleteUser = async (clerkId: string) => {
	try {
		await connectToDatabase();

		const deletedUser = await User.findOneAndDelete({ clerkId });

		if (!deletedUser) {
			throw new Error("User not found");
		}

		return JSON.parse(JSON.stringify(deletedUser));
	} catch (error) {
		console.error("Error deleting user:", error);
	}
};
