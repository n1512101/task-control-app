import { Types } from "mongoose";

export interface ITask {
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
  date: Date;
}

export interface ITaskWithID extends ITask {
  _id: Types.ObjectId;
}

export interface ITaskSchema extends ITask {
  userId: Types.ObjectId;
  completedAt: Date | null;
  reminderCount: 0 | 1 | 2 | 3;
  nextReminderAt: Date | null;
}

export type IUpdateTask = { _id: Types.ObjectId } & Partial<
  Pick<ITask, "description" | "status" | "category">
>;
