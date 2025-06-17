import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
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
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);

// appにrouterを定義する
addRoutes(app);
// 定期的にリマインダーメール送信
scheduledReviewReminders();
// 毎日0時にルーティンを初期化する
initializeRoutines();

app.listen(port, () => {
  console.log("Server is running.");
});
