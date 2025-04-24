import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import dbConnect from "./src/config/dbConnect";
import addRoutes from "./src/config/routes.config";

// データベース接続
dbConnect();

const app: Express = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
  })
);

// appにrouterを定義する
addRoutes(app);

app.listen(port, () => {
  console.log("Server is running.");
});
