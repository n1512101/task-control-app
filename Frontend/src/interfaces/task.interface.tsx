export type IRepeatType = "daily" | "weekly";
export type ICategory = "study" | "job" | "recreation" | "exercise";

export interface ITask {
  date: string;
  category: ICategory;
  description: string;
  status: "pending" | "done";
}

// APIから帰ってくるタスクの型
export interface ITaskResponse extends Omit<ITask, "date"> {
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

// ルーティン更新時の引数の型
export type IUpdateRoutine = { _id: string } & Partial<
  Pick<IRoutineResponse, "description" | "status">
>;
