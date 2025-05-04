import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Result, validationResult } from "express-validator";
import RoutineController from "./routine.controller";
import { createRoutineValidator } from "./validators/createRoutine.validator";
import { IRoutine } from "./routine.interface";

@injectable()
export default class RoutineRouter {
  public router: Router;

  constructor(
    @inject(RoutineController) private routineController: RoutineController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ルーティン作成API
    this.router.post(
      "/create",
      createRoutineValidator,
      async (req: Request<{}, {}, IRoutine>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          await this.routineController.create(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );
  }
}
