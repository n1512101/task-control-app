import { Application } from "express";
import container from "./container";
import UsersRouter from "../user/users.router";
import AuthRouter from "../auth/auth.router";

// ルートを追加する関数
export default function addRoutes(app: Application) {
  // DIコンテナから各コンテナのインスタンスを取得
  const usersRouter = container.get<UsersRouter>(UsersRouter);
  const authRouter = container.get<AuthRouter>(AuthRouter);

  // routerを登録する
  app.use("/user", usersRouter.router);
  app.use("/auth", authRouter.router);
}
