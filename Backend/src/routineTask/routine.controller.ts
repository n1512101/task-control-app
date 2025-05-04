import { Request, Response } from "express";
import { injectable } from "inversify";
import { matchedData } from "express-validator";
import { IRoutine } from "./routine.interface";
import { RoutineTask } from "../models/routineTask.model";

@injectable()
export default class RoutineController {
  constructor() {}

  // ルーティン作成時の処理
  public async create(req: Request<{}, {}, IRoutine>, res: Response) {
    // 余分なデータがあった場合除去する
    const validateData: IRoutine = matchedData(req);

    try {
      const newRoutine = new RoutineTask({ ...validateData });
      await newRoutine.save();
      res.status(200).json("ルーティン作成成功！");
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
