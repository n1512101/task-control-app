import { Types } from "mongoose";

export interface ITask {
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
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

export interface ITaskSchemaWithID extends ITaskSchema {
  _id: Types.ObjectId;
}

export type IUpdateTask = { _id: Types.ObjectId } & Partial<
  Pick<ITask, "description" | "status" | "category">
>;
