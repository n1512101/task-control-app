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

export interface IEventTask {
  id: string;
  allDay: boolean;
  start: Date;
  end: Date;
  title: string;
  category: ICategory;
  status: "pending" | "done";
}
