import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import dbConnect from "./src/config/dbConnect";
import addRoutes from "./src/config/routes.config";
import scheduledReviewReminders from "./src/regularProcessing/reviewReminder";
import initializeRoutines from "./src/regularProcessing/initializeRoutines";

// データベース接続
dbConnect();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// appにrouterを定義する
addRoutes(app);

// Reactアプリのホスティング設定
const root = path.join(__dirname, "..", "public");
app.use(express.static(root));
// SPA対応：すべてのその他のリクエストをindex.htmlにフォールバック
app.get("*", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

// 定期的にリマインダーメール送信
scheduledReviewReminders();
// 毎日0時にルーティンを初期化する
initializeRoutines();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
