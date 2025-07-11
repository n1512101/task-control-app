import { Request, Response } from "express";
import { injectable } from "inversify";
import { ITask, IUpdateTask } from "./task.interface";
import { matchedData } from "express-validator";
import { Task } from "../models/task.model";
import { Types } from "mongoose";
import dayjs from "dayjs";

@injectable()
export default class TaskController {
  constructor() {}

  // タスク作成時の処理
  public async createTask(req: Request<{}, {}, ITask>, res: Response) {
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

  // タスク取得時の処理
  public async getTasks(req: Request, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const tasks = await Task.find({
        userId: req.user.id,
        startDate: { $gte: today, $lt: tomorrow },
      }).select([
        "_id",
        "category",
        "description",
        "status",
        "startDate",
        "endDate",
        "isAllDay",
      ]);
      res.status(200).json({ tasks });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // 全てのタスクを取得時の処理
  public async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await Task.find({
        userId: req.user.id,
      }).select([
        "_id",
        "category",
        "description",
        "status",
        "startDate",
        "endDate",
        "isAllDay",
      ]);
      res.status(200).json({ tasks });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // タスクを更新する際の処理
  public async updateTask(req: Request<{}, {}, IUpdateTask>, res: Response) {
    try {
      const { _id, description, status, category } = req.body;
      // 更新対象フィールド
      const updateFields: Pick<IUpdateTask, "description" | "status"> & {
        completedAt?: string | null;
        nextReminderAt?: string | null;
        reminderCount?: number;
      } = {};
      if (description !== undefined) updateFields.description = description;
      if (status !== undefined) {
        updateFields.status = status;
        if (status === "done") {
          updateFields.completedAt = dayjs().format("YYYY-MM-DD");
          if (category === "study") {
            updateFields.nextReminderAt = dayjs()
              .add(1, "day")
              .format("YYYY-MM-DD");
          }
        } else {
          updateFields.completedAt = null;
          if (category === "study") {
            updateFields.nextReminderAt = null;
            updateFields.reminderCount = 0;
          }
        }
      }

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "更新対象が指定されていません" });
      }

      const result = await Task.updateOne({ _id }, { $set: updateFields });
      if (!result.matchedCount) {
        return res.status(404).json({ message: "該当するタスクはありません" });
      }
      res.status(200).json({ message: "タスク更新成功！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  //タスクを削除する際の処理
  public async deleteTask(
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

      const result = await Task.deleteOne({ _id });
      if (!result.deletedCount) {
        return res.status(404).json({ message: "削除対象が存在しません" });
      }
      res.status(200).json({ message: "タスクを削除しました！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
