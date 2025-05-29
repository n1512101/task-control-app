import cron from "node-cron";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";

// ユーザにリマインダーメールを送信する関数
async function reviewReminders() {
  const date = new Date();
  const tasks = await Task.find({
    category: "study",
    status: "done",
    reminderCount: { $lt: 4 },
    nextReminderAt: { $lte: date },
  });
  // userIdがキー、タスク内容が値となるMap型配列
  const tasksByUser = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const userId = task.userId.toString();
    if (!tasksByUser.has(userId)) {
      tasksByUser.set(userId, []);
    }
    tasksByUser.get(userId)!.push(task);
  }
  // 各ユーザにメールを送信する
  for (const [userId, userTasks] of tasksByUser.entries()) {
    const user = await User.findById(userId).select(["email"]);
    if (!user?.email) continue;

    let message = userTasks
      .map(
        (task) =>
          `${dayjs(task.completedAt).locale("ja").format("YYYY/MM/DD(ddd)")}に${
            task.description
          }を学習しました！\n`
      )
      .join();
    message += "復習を行いましょう！";
    sendMail(user.email, message);
  }
}

// 実際のメール送信ロジック
async function sendMail(address: string, message: string) {
  console.log(address);
  console.log(message);
}

export default reviewReminders;
