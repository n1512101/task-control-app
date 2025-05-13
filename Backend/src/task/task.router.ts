import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import TaskController from "./task.controller";
import verifyAccessToken from "../middlewares/verifyAccessToken";
import { createTaskValidator } from "./validators/createTask.validator";
import { ITask } from "./task.interface";
import { Result, validationResult } from "express-validator";

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
          await this.taskController.create(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );
  }
}
