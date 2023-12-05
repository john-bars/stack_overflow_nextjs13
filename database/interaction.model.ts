import { Document, Schema, model, models } from "mongoose";

// Define the interface
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // reference to user
  action: string;
  question: Schema.Types.ObjectId; // reference to question
  answer: Schema.Types.ObjectId; // reference to answer
  tags: Schema.Types.ObjectId[]; // reference to tag
  createdAt: Date;
}

// Define the schema
const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

// Create or retrieve the model
const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
