export interface IRoutine {
  repeatType: "daily" | "weekly";
  category: "study" | "job" | "recreation" | "exercise";
  description: string;
  status: "pending" | "done";
}
