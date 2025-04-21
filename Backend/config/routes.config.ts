import { Application } from "express";
import container from "./container";
import UsersRouter from "../user/users.router";

// ルートを追加する関数
export default function addRoutes(app: Application) {
  // DIコンテナから各コンテナのインスタンスを取得
  const usersRouter = container.get<UsersRouter>(UsersRouter);

  // routerを登録する
  app.use("/user", usersRouter.router);
}
