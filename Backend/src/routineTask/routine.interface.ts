import { Types } from "mongoose";

export interface IRoutine {
  repeatType: "daily" | "weekly";
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
}

export interface IRoutineSchema extends IRoutine {
  userId: Types.ObjectId;
}

export type IUpdateRoutine = { _id: Types.ObjectId } & Partial<
  Pick<IRoutine, "description" | "status">
>;
