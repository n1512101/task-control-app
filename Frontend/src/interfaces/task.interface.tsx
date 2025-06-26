export type IRepeatType = "daily" | "weekly";
export type ICategory = "study" | "job" | "recreation" | "exercise";

export interface ITask {
  startDate: string;
  endDate: string;
  category: ICategory;
  description: string;
  status: "pending" | "done";
}

// APIから帰ってくるタスクの型
export interface ITaskResponse extends ITask {
  _id: string;
}

export interface IRoutine {
  repeatType: IRepeatType;
  category: ICategory;
  description: string;
  status: "pending" | "done";
}

// APIから帰ってくるルーティンの型
export interface IRoutineResponse extends IRoutine {
  _id: string;
}

// タスク更新時の引数の型
export interface IUpdateTask {
  _id: string;
  description?: string;
  status?: "pending" | "done";
  category?: ICategory;
}
