"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

// GET THE TOP INTERACTED TAGS BY A USER
export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findById(userId); // get the user by id

    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Find interactions for the user and group by tags
    // Interaction...

    const temporaryTags = [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
    return temporaryTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
