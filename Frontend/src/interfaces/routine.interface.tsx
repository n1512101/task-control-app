export interface IRoutine {
  repeatType: "daily" | "weekly";
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
}

// APIから帰ってくるルーティンの型
export interface IRoutineTask extends IRoutine {
  _id: string;
  userId: string;
}
