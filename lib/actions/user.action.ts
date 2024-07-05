"use server";

import User, { Address } from "../database/models/User.model";
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

interface AddAddressProps {
	clerkId: string;
	address: Address; // Assuming Address is properly defined in your User model
}

export interface UpdateAddressProps {
	clerkId: string;
	address: {
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
		console.error("Error creating user:", error);
	}
};

export const getUserById = async (userId: string) => {
	try {
		await connectToDatabase();

		const user = await User.findOne({ _id: userId });
		if (!user) {
			return {};
		}
		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.error("Error getting user:", error);
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

export const addAddressToUser = async ({
	clerkId,
	address,
}: AddAddressProps) => {
	try {
		await connectToDatabase();

		// Find the user by clerkId
		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error("User not found");
		}

		// Update the user's address
		user.address = address;

		// Set hasProfileCompleted to true
		user.hasProfileCompleted = true;

		// Save the updated user
		await user.save();

		return JSON.parse(JSON.stringify(user)); // Return the updated user
	} catch (error) {
		console.error("Error adding address to user:", error);
	}
};

export const updateAddressOfUser = async ({
	clerkId,
	address,
}: UpdateAddressProps) => {
	try {
		await connectToDatabase();

		// Find the user by userId
		const user = await User.findOne({ clerkId: clerkId });

		if (!user) {
			throw new Error("User not found");
		}

		// Update the user's address fields
		user.address.street = address.street;
		user.address.city = address.city;
		user.address.state = address.state;
		user.address.country = address.country;
		user.address.postalCode = address.postalCode;

		// Save the updated user
		await user.save();

		return JSON.parse(JSON.stringify(user)); // Return the updated user
	} catch (error) {
		console.error("Error updating address of user:", error);
		throw error; // Rethrow the error to handle it in the caller function
	}
};
