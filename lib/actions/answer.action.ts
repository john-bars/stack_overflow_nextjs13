"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

// CREATE AN ANSWER
export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;

    // Create new answer in the database using the 'Answer' model
    const newAnswer = await Answer.create({ content, author, question });

    // Add the id of the newly created answer to the 'answers' array in the 'Question' model
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log("Error in createAnswer", error);
    throw new Error("Failed to create an answer");
  }
}

// GET THE ALL THE ANSWERS IN A QUESTION
export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    // Find answers in the database based on the question id
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture") // populate the 'author' field with additional data
      .sort({ createdAt: -1 }); // (newest first)

    return { answers };
  } catch (error) {
    console.log("Error in getAnswers", error);
    throw new Error("Failed to get the answers in the database");
  }
}
