import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Result, validationResult } from "express-validator";
import RoutineController from "./routine.controller";
import { createRoutineValidator } from "./validators/createRoutine.validator";
import { IRoutine, IUpdateRoutine } from "./routine.interface";
import verifyAccessToken from "../middlewares/verifyAccessToken";
import { Types } from "mongoose";

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
      verifyAccessToken,
      createRoutineValidator,
      async (req: Request<{}, {}, IRoutine>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          await this.routineController.createRoutine(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );

    // ルーティン取得API
    this.router.get(
      "/",
      verifyAccessToken,
      async (req: Request, res: Response) => {
        await this.routineController.getRoutines(req, res);
      }
    );

    // ルーティンを更新するAPI
    this.router.put(
      "/",
      verifyAccessToken,
      async (req: Request<{}, {}, IUpdateRoutine>, res: Response) => {
        await this.routineController.updateRoutine(req, res);
      }
    );

    // ルーティンを削除するAPI
    this.router.delete(
      "/",
      verifyAccessToken,
      async (req: Request<{}, {}, { _id: Types.ObjectId }>, res: Response) => {
        await this.routineController.deleteRoutine(req, res);
      }
    );
  }
}
