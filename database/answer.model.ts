import { Schema, Document, model, models } from "mongoose";

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[]; // expected to by an array of id of users
  downvotes: Schema.Types.ObjectId[]; // expected to by an array of id of users
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

// use the Answer from the existing models or create one if it doesn't exist using the AnswerSchema
const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
