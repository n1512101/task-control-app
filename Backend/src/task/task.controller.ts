import { Request, Response } from "express";
import { injectable } from "inversify";
import { ITask } from "./task.interface";
import { matchedData } from "express-validator";
import { Task } from "../models/task.model";

@injectable()
export default class TaskController {
  constructor() {}

  // タスク作成時の処理
  public async create(req: Request<{}, {}, ITask>, res: Response) {
    // 余分なデータがあった場合除去する
    const validateData: ITask = matchedData(req);

    try {
      const newTask = new Task({
        ...validateData,
        userId: req.user.id,
      });
      await newTask.save();
      res.status(200).json("タスク作成成功！");
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
