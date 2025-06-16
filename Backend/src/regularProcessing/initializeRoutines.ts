import cron from "node-cron";
import { RoutineTask } from "../models/routineTask.model";

// 毎日0時にルーティンを初期化する
export default function initializeRoutines() {
  try {
    cron.schedule("0 0 15 * * *", async () => {
      await RoutineTask.find({ status: "done" }).updateMany({
        status: "pending",
      });
    });
  } catch (error) {
    console.error("ルーティンの初期化に失敗しました", error);
  }
}
