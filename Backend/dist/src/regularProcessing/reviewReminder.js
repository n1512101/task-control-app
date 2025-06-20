"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ja");
const task_model_1 = require("../models/task.model");
const user_model_1 = require("../models/user.model");
// 実際のメール送信ロジック
function sendMail(toEmail, subject, body) {
  return __awaiter(this, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
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
  });
}
// ユーザーごとのタスクをグループ化する関数
function groupTasksByUser(tasks) {
  const tasksByUser = new Map();
  for (const task of tasks) {
    const userId = task.userId.toString();
    if (!tasksByUser.has(userId)) {
      tasksByUser.set(userId, []);
    }
    tasksByUser.get(userId).push(task);
  }
  return tasksByUser;
}
// 各ユーザーのメール送信処理
function processUserTasks(userId, userTasks) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const user = yield user_model_1.User.findById(userId).select(["email"]);
      if (!(user === null || user === void 0 ? void 0 : user.email)) {
        console.warn(`ユーザ${userId}のメールアドレスが見つかりません。`);
        return;
      }
      const message = buildReminderMessage(userTasks);
      // ユーザにメール送信
      yield sendMail(user.email, "復習をしませんか？", message);
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
        const nextReminderAt = (0, dayjs_1.default)()
          .add(daysToAdd, "day")
          .format("YYYY-MM-DD");
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
      yield task_model_1.Task.bulkWrite(bulkOperations);
    } catch (userErr) {
      console.error(`ユーザ ${userId} の処理中にエラー:`, userErr);
    }
  });
}
// メール本文を作成する関数
function buildReminderMessage(tasks) {
  const message = tasks
    .map(
      (task) =>
        `${(0, dayjs_1.default)(task.completedAt)
          .locale("ja")
          .format("YYYY/MM/DD(ddd)")}に${
          task.description
        }の学習を行いました！\n`
    )
    .join("");
  return message + "復習を行いましょう！";
}
// ユーザにリマインダーメールを送信する関数
function reviewReminders() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const date = new Date();
      const tasks = yield task_model_1.Task.find({
        category: "study",
        status: "done",
        reminderCount: { $lt: 4 },
        nextReminderAt: { $lte: date },
      });
      // tasksByUser: userIdがキー、タスク内容が値となるMap型配列
      const tasksByUser = groupTasksByUser(tasks);
      // 各ユーザにメールを送信する
      for (const [userId, userTasks] of tasksByUser.entries()) {
        yield processUserTasks(userId, userTasks);
      }
    } catch (error) {
      console.error("reviewReminders 処理中にエラーが発生しました:", error);
    }
  });
}
// 毎日のUTC時間の23時(日本時間8時)に実行する
function scheduledReviewReminders() {
  node_cron_1.default.schedule("0 44 12 * * *", () => {
    reviewReminders();
  });
}
exports.default = scheduledReviewReminders;
