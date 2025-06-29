import { body } from "express-validator";

// タスク作成APIバリデーションチェック
export const createTaskValidator = [
  body("category")
    .notEmpty()
    .withMessage("タスクのカテゴリーが必要です")
    .isIn(["study", "job", "recreation", "exercise"])
    .withMessage("カテゴリーの値が間違っています"),
  body("description")
    .notEmpty()
    .withMessage("タスクの内容が必要です")
    .isLength({ min: 1 })
    .withMessage("タスクの内容が最低1文字必要です")
    .trim(),
  body("status")
    .notEmpty()
    .withMessage("タスクの状態が必要です")
    .isIn(["pending"])
    .withMessage("状態の値が間違っています"),
  body("startDate")
    .notEmpty()
    .withMessage("日付が必要です")
    .isISO8601()
    .withMessage("日付の形式が正しくありません"),
  body("endDate")
    .notEmpty()
    .withMessage("日付が必要です")
    .isISO8601()
    .withMessage("日付の形式が正しくありません"),
  body("isAllDay")
    .notEmpty()
    .withMessage("終日かどうかが必要です")
    .isBoolean()
    .withMessage("終日かどうかの値が間違っています"),
];
