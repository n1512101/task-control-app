import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import dbConnect from "./config/dbConnect";
import addRoutes from "./config/routes.config";

// データベース接続
dbConnect();

const app: Express = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

// appにrouterを定義する
addRoutes(app);

app.listen(port, () => {
  console.log("Server is running.");
});
