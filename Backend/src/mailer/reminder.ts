import cron from "node-cron";
import { Task } from "../models/task.model";

async function sendReviewReminders() {
  const date = new Date();
  const tasks = await Task.find({
    status: "done",
    reminderCount: { $lt: 4 },
    nextReminderAt: { $lte: date },
  });
  console.log(tasks);
}

export default sendReviewReminders;
