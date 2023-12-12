"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

// GET QUESTIONS
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    // If a searchQuery is provided, construct a MongoDB $or query for title or content
    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
    }

    // Retrieve questions from the database based on the constructed query
    const questions = await Question.find(query) // get all the questions that matches the query
      .populate({ path: "tags", model: Tag }) // include the tags
      .populate({ path: "author", model: User }) // include the author
      .sort(sortOptions); // sort by the latest question

    return { questions }; // Return the retrieved questions as an object
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

// UPVOTE A QUESTION
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    connectToDatabase();

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // todo: Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log("Error in upvoteQuestion: ", error);
    throw new Error("Failed to upvote a question");
  }
}

// DOWNVOTE A QUESTION
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    connectToDatabase();

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Error in downvoteQuestion: ", error);
    throw new Error("Failed to downvote a question");
  }
}

// DELETE A QUESTION
export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });

    // Delete all answers and interactions associated with the question
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });

    // remove the questionId in the questions[] of tags
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log("Error in deleteQuestion: ", error);
    throw new Error("Failed to delete a question");
  }
}

// EDIT A QUESTION
export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title; // change the value of 'question.title' to the value of 'title'
    question.content = content; // change the value of 'question.content' to whatever the value of 'content'

    await question.save(); // Asynchronously save changes to the database

    revalidatePath(path);
  } catch (error) {
    console.log("Error in editQuestion", error);
    throw new Error("Failed to Update the Question");
  }
}

// GET HOT QUESTIONS
export async function getHotQuestions() {
  try {
    connectToDatabase();

    // get all the questions and sort them with views and upvotes  in descending order
    const hotQuestions = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log("Error in getHotQuestions", error);
    throw error;
  }
}
