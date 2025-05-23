import { Application } from "express";
import container from "./container";
import UsersRouter from "../user/users.router";
import AuthRouter from "../auth/auth.router";
import RoutineRouter from "../routineTask/routine.router";
import TaskRouter from "../task/task.router";

// ルートを追加する関数
export default function addRoutes(app: Application) {
  // DIコンテナから各コンテナのインスタンスを取得
  const usersRouter = container.get<UsersRouter>(UsersRouter);
  const authRouter = container.get<AuthRouter>(AuthRouter);
  const routineRouter = container.get<RoutineRouter>(RoutineRouter);
  const taskRouter = container.get<TaskRouter>(TaskRouter);

  // routerを登録する
  app.use("/user", usersRouter.router);
  app.use("/auth", authRouter.router);
  app.use("/routine", routineRouter.router);
  app.use("/task", taskRouter.router);
}
