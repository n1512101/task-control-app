import { Types } from "mongoose";

export interface ITask {
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
  date: Date;
}

export interface ITaskSchema extends ITask {
  userId: Types.ObjectId;
  completedAt: Date | null;
  reminderCount: 0 | 1 | 2 | 3;
  nextReminderAt: Date | null;
}
