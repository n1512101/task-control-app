export type IRepeatType = "daily" | "weekly";
export type ICategory = "study" | "job" | "recreation" | "exercise";

export interface ITask {
  _id: string;
  startDate: string;
  endDate: string;
  category: ICategory;
  description: string;
  status: "pending" | "done";
  isAllDay: boolean;
}

export interface IRoutine {
  _id: string;
  repeatType: IRepeatType;
  category: ICategory;
  description: string;
  status: "pending" | "done";
}

// タスク更新時の引数の型
export type IUpdateTask = { _id: string } & Partial<Omit<ITask, "_id">>;
