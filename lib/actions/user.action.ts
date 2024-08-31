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
  isOwner?: boolean;
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
  address: Address;
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

/**
 * Creates a new user in the database.
 */
export const createUser = async (user: createUserProps) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Retrieves a user by Clerk ID.
 */
export const getUserById = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return {};
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

/**
 * Updates user details by Clerk ID.
 */
export const updateUser = async (
  clerkId: string,
  updateProps: UpdateUserProps,
) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateProps, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Deletes a user by Clerk ID.
 */
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error: any) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

/**
 * Adds an address to the user's profile.
 */
export const addAddressToUser = async ({
  clerkId,
  address,
}: AddAddressProps) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    user.address = address;
    user.hasProfileCompleted = true;

    await user.save();

    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    throw new Error(`Error adding address: ${error.message}`);
  }
};

/**
 * Updates the user's address fields.
 */
export const updateAddressOfUser = async ({
  clerkId,
  address,
}: UpdateAddressProps) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    user.address.street = address.street;
    user.address.city = address.city;
    user.address.state = address.state;
    user.address.country = address.country;
    user.address.postalCode = address.postalCode;

    await user.save();

    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    throw new Error(`Error updating address: ${error.message}`);
  }
};

/**
 * Retrieves a list of users except the provided user ID.
 */
export const getUsers = async (userId: string): Promise<User[]> => {
  try {
    await connectToDatabase();
    const users = await User.find({ clerkId: { $ne: userId } }).sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return [];
  }
};

/**
 * Grants admin privileges to a user.
 */
export const addAdmin = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.isAdmin = true;
    await user.save();

    return { success: true, message: "User granted admin privileges" };
  } catch (error: any) {
    return { success: false, message: "An error occurred while adding admin" };
  }
};

/**
 * Removes admin privileges from a user, ensuring the owner cannot be removed.
 */
export const removeAdmin = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.isOwner) {
      return { success: false, message: "Owner cannot be removed as admin" };
    }

    user.isAdmin = false;
    await user.save();

    return { success: true, message: "Admin privileges removed from user" };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while removing admin",
    };
  }
};

/**
 * Finds users based on a query that matches Clerk ID, email, or username.
 */
export const findUserFromQuery = async (query: string) => {
  try {
    await connectToDatabase();

    const users = await User.find({
      $or: [{ clerkId: query }, { email: query }, { username: query }],
    });

    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return [];
  }
};

/**
 * Retrieves the user's address if their profile is complete.
 */
export const getUserAddress = async (userClerkId: string) => {
  try {
    await connectToDatabase();
    const user: User = await getUserById(userClerkId);
    if (user.hasProfileCompleted) {
      return { success: true, address: user.address };
    } else {
      return {
        success: false,
        message: "User profile is incomplete. Please add an address",
      };
    }
  } catch (error: any) {
    return {};
  }
};
