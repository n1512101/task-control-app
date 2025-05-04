import { model, Model, Schema } from "mongoose";
import { IRoutine } from "../routineTask/routine.interface";

const routineSchema: Schema<IRoutine> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  repeatType: {
    type: String,
    enum: ["daily", "weekly"],
    required: true,
  },
  category: {
    type: String,
    enum: ["study", "job", "recreation", "exercise"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    minlength: 1,
  },
  status: {
    type: String,
    enum: ["pending", "done"],
    required: true,
  },
});

export const RoutineTask: Model<IRoutine> = model(
  "RoutineTasks",
  routineSchema
);
