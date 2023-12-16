"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" }; // Create a case-insensitive regular expression using the provided query.
    const typeLower = type?.toLowerCase();

    let results = [];
    const modelsAndTypes = [
      { model: Question, searchfield: "title", type: "question" },
      { model: User, searchfield: "name", type: "user" },
      { model: Answer, searchfield: "content", type: "answer" },
      { model: Tag, searchfield: "name", type: "tag" },
    ];

    // If 'type' query value is not defined, search across all types
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      for (const { model, searchfield, type } of modelsAndTypes) {
        // Using 'forEach' and 'map' won't work well with async-await
        const queryResults = await model
          .find({ [searchfield]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchfield],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      // Search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchfield]: regexQuery,
        })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchfield],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log("Error fetching global result: ", error);
    throw error;
  }
}
