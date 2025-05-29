import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./src/config/dbConnect";
import addRoutes from "./src/config/routes.config";
import reviewReminders from "./src/mailer/reminder";

// データベース接続
dbConnect();

const app: Express = express();
const port = process.env.SERVER_PORT;

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

reviewReminders();

app.listen(port, () => {
  console.log("Server is running.");
});
