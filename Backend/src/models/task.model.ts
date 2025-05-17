import { model, Model, Schema } from "mongoose";
import { ITaskSchema } from "../task/task.interface";

const taskSchema: Schema<ITaskSchema> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
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
  date: {
    type: Date,
    required: true,
    index: { expires: parseInt(process.env.TASK_EXPIRY as string) },
  },
  completedAt: {
    type: Date,
    default: null,
  },
  reminderCount: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
    required: true,
  },
  nextReminderAt: {
    type: Date,
    default: null,
  },
});

export const Task: Model<ITaskSchema> = model("Tasks", taskSchema);
