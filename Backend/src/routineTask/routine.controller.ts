import { Request, Response } from "express";
import { injectable } from "inversify";
import { matchedData } from "express-validator";
import { Types } from "mongoose";
import { IRoutine, IUpdateRoutine } from "./routine.interface";
import { RoutineTask } from "../models/routineTask.model";

@injectable()
export default class RoutineController {
  constructor() {}

  // ルーティン作成時の処理
  public async create(req: Request<{}, {}, IRoutine>, res: Response) {
    // 余分なデータがあった場合除去する
    const validateData: IRoutine = matchedData(req);

    try {
      const newRoutine = new RoutineTask({
        ...validateData,
        userId: req.user.id,
      });
      await newRoutine.save();
      res.status(200).json("ルーティン作成成功！");
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ルーティン取得時の処理
  public async getRoutine(req: Request, res: Response) {
    try {
      const tasks = await RoutineTask.find({
        userId: req.user.id,
        repeatType: req.query.repeatType,
      });
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ルーティン更新時の処理
  public async updateRoutine(
    req: Request<{}, {}, IUpdateRoutine>,
    res: Response
  ) {
    try {
      const { _id, description, status } = req.body;
      // 更新対象フィールド
      const updateFields: Partial<Pick<IRoutine, "description" | "status">> =
        {};
      if (description !== undefined) updateFields.description = description;
      if (status !== undefined) updateFields.status = status;

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "更新対象が指定されていません" });
      }

      const result = await RoutineTask.updateOne(
        { _id },
        { $set: updateFields }
      );
      if (!result.matchedCount) {
        return res
          .status(404)
          .json({ message: "該当するルーティンはありません" });
      }

      res.status(200).json({ message: "ルーティン更新成功！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ルーティン削除時の処理
  public async deleteRoutine(
    req: Request<{}, {}, { _id: Types.ObjectId }>,
    res: Response
  ) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res
          .status(400)
          .json({ message: "削除対象が指定されていません" });
      }

      const result = await RoutineTask.deleteOne({ _id });
      if (!result.deletedCount) {
        return res.status(404).json({ message: "削除対象が存在しません" });
      }
      res.status(200).json({ message: "ルーティンを削除しました！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
