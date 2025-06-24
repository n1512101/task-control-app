import cron from "node-cron";
import nodemailer from "nodemailer";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { ITaskSchemaWithID } from "../task/task.interface";

// 実際のメール送信ロジック
async function sendMail(
  toEmail: string,
  subject: string,
  body: string
): Promise<void> {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  });
  let mailOptions = {
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
// ユーザーごとのタスクをグループ化する関数
function groupTasksByUser(
  tasks: ITaskSchemaWithID[]
): Map<string, ITaskSchemaWithID[]> {
  const tasksByUser = new Map<string, ITaskSchemaWithID[]>();
  for (const task of tasks) {
    const userId = task.userId.toString();
    if (!tasksByUser.has(userId)) {
      tasksByUser.set(userId, []);
    }
    tasksByUser.get(userId)!.push(task);
  }
  return tasksByUser;
}
// 各ユーザーのメール送信処理
async function processUserTasks(
  userId: string,
  userTasks: ITaskSchemaWithID[]
) {
  try {
    const user = await User.findById(userId).select(["email"]);
    if (!user?.email) {
      console.warn(`ユーザ${userId}のメールアドレスが見つかりません。`);
      return;
    }
    const message = buildReminderMessage(userTasks);
    // ユーザにメール送信
    await sendMail(user.email, "復習をしませんか？", message);

    // 各タスクの更新内容を計算する
    const bulkOperations = userTasks.map((task) => {
      let daysToAdd = 1;
      if (task.reminderCount === 1) {
        daysToAdd = 3;
      } else if (task.reminderCount === 2) {
        daysToAdd = 7;
      } else if (task.reminderCount === 3) {
        daysToAdd = 10;
      }
      const nextReminderAt = dayjs().add(daysToAdd, "day").format("YYYY-MM-DD");

      return {
        updateOne: {
          filter: { _id: task._id },
          update: {
            $inc: { reminderCount: 1 },
            $set: { nextReminderAt },
          },
        },
      };
    });
    // メール送信回数reminderCountと次回のリマインダー日付nextReminderAtを更新
    await Task.bulkWrite(bulkOperations);
  } catch (userErr) {
    console.error(`ユーザ ${userId} の処理中にエラー:`, userErr);
  }
}
// メール本文を作成する関数
function buildReminderMessage(tasks: ITaskSchemaWithID[]): string {
  const message = tasks
    .map(
      (task) =>
        `${dayjs(task.completedAt).locale("ja").format("YYYY/MM/DD(ddd)")}に${
          task.description
        }の学習を行いました！\n`
    )
    .join("");
  return message + "復習を行いましょう！";
}

// ユーザにリマインダーメールを送信する関数
async function reviewReminders() {
  try {
    const date = new Date();
    const tasks = await Task.find({
      category: "study",
      status: "done",
      reminderCount: { $lt: 4 },
      nextReminderAt: { $lte: date },
    });
    // tasksByUser: userIdがキー、タスク内容が値となるMap型配列
    const tasksByUser = groupTasksByUser(tasks);
    // 各ユーザにメールを送信する
    for (const [userId, userTasks] of tasksByUser.entries()) {
      await processUserTasks(userId, userTasks);
    }
  } catch (error) {
    console.error("reviewReminders 処理中にエラーが発生しました:", error);
  }
}

// 毎日のUTC時間の1時(日本時間10時)に実行する
function scheduledReviewReminders() {
  cron.schedule("0 0 1 * * *", () => {
    reviewReminders();
  });
}

export default scheduledReviewReminders;
