import cron from "node-cron";
import { RoutineTask } from "../models/routineTask.model";

// ルーティンを初期化する
export default function initializeRoutines() {
  try {
    // 毎日0時に日ごとのルーティンを初期化
    cron.schedule("0 0 15 * * *", async () => {
      await RoutineTask.find({
        repeatType: "daily",
        status: "done",
      }).updateMany({
        status: "pending",
      });
    });
    // 毎週月曜日の0時に週ごとのルーティンを初期化
    cron.schedule("0 0 15 * * 7", async () => {
      await RoutineTask.find({
        repeatType: "weekly",
        status: "done",
      }).updateMany({
        status: "pending",
      });
    });
  } catch (error) {
    console.error("ルーティンの初期化に失敗しました", error);
  }
}
