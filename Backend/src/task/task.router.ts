import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import TaskController from "./task.controller";
import verifyAccessToken from "../middlewares/verifyAccessToken";
import { createTaskValidator } from "./validators/createTask.validator";
import { ITask, IUpdateTask } from "./task.interface";
import { Result, validationResult } from "express-validator";
import { Types } from "mongoose";

@injectable()
export default class TaskRouter {
  public router: Router;

  constructor(@inject(TaskController) private taskController: TaskController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // タスク作成API
    this.router.post(
      "/create",
      verifyAccessToken,
      createTaskValidator,
      async (req: Request<{}, {}, ITask>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          await this.taskController.createTask(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );

    // タスク取得API
    this.router.get(
      "/",
      verifyAccessToken,
      async (req: Request, res: Response) => {
        await this.taskController.getTasks(req, res);
      }
    );

    // 全てのタスクを取得するAPI
    this.router.get(
      "/all",
      verifyAccessToken,
      async (req: Request, res: Response) => {
        await this.taskController.getAllTasks(req, res);
      }
    );

    // タスクを更新するAPI
    this.router.put(
      "/",
      verifyAccessToken,
      async (req: Request<{}, {}, IUpdateTask>, res: Response) => {
        await this.taskController.updateTask(req, res);
      }
    );

    // タスクを削除するAPI
    this.router.delete(
      "/",
      verifyAccessToken,
      async (req: Request<{}, {}, { _id: Types.ObjectId }>, res: Response) => {
        await this.taskController.deleteTask(req, res);
      }
    );
  }
}
