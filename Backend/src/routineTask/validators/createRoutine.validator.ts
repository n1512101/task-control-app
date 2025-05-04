import { body } from "express-validator";

// ルーティン作成APIバリデーションチェック
export const createRoutineValidator = [
  body("repeatType")
    .notEmpty()
    .withMessage("ルーティンのタイプが必要です")
    .isIn(["weekly", "daily"])
    .withMessage("タイプの値が間違っています"),
  body("category")
    .notEmpty()
    .withMessage("ルーティンのカテゴリーが必要です")
    .isIn(["study", "job", "recreation", "exercise"])
    .withMessage("カテゴリーの値が間違っています"),
  body("description")
    .notEmpty()
    .withMessage("ルーティンの内容が必要です")
    .isLength({ min: 1 })
    .withMessage("ルーティンの内容が最低1文字必要です")
    .trim(),
  body("status")
    .notEmpty()
    .withMessage("ルーティンの状態が必要です")
    .isIn(["pending"])
    .withMessage("状態の値が間違っています"),
];
