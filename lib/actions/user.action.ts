"use server";

import User from "@/database/user.model";
import { connecteToDatabase } from "../mongoose";

// get the user with a clerkId equall to userId
export async function getUserById(params: any) {
  try {
    connecteToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}