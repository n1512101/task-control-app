export type IRepeatType = "daily" | "weekly";
export type ICategory = "study" | "job" | "recreation" | "exercise";

export interface IRoutine {
  repeatType: IRepeatType;
  category: ICategory;
  description: string;
  status: "pending" | "done";
}

// APIから帰ってくるルーティンの型
export interface IRoutineTask extends IRoutine {
  _id: string;
  userId: string;
}

// ルーティン更新時の引数の型
export type IUpdateRoutine = { _id: string } & Partial<
  Pick<IRoutineTask, "description" | "status">
>;
