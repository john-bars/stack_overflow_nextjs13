"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// GET QUESTIONS
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({}) // get all the questions
      .populate({ path: "tags", model: Tag }) // include the tags
      .populate({ path: "author", model: User }) // include the author
      .sort({ createdAt: -1 }); // sort by the latest question

    return { questions };
  } catch (error) {
    console.error("Error in getQuestions:", error);
    throw new Error("Failed to retrieve questions.");
  }
}

// CREATE QUESTION
export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase(); // access the database

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$^`, "i") } }, // filter
        { $setOnInsert: { name: tag }, $push: { questions: question._id } }, // update
        { upsert: true, new: true } // options
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for createing a question.

    revalidatePath(path);
  } catch (error) {
    console.error("Error in createQuestion: ", error);
    throw new Error("Failed to create a question.");
  }
}

// GET INDIVIDUAL QUESTION
export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    if (!question) {
      throw new Error("Question not found");
    }

    return question;
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    throw new Error("Failed to get question by ID");
  }
}
