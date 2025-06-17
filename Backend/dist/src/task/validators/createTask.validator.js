"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
// タスク作成APIバリデーションチェック
exports.createTaskValidator = [
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("タスクのカテゴリーが必要です")
        .isIn(["study", "job", "recreation", "exercise"])
        .withMessage("カテゴリーの値が間違っています"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("タスクの内容が必要です")
        .isLength({ min: 1 })
        .withMessage("タスクの内容が最低1文字必要です")
        .trim(),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("タスクの状態が必要です")
        .isIn(["pending"])
        .withMessage("状態の値が間違っています"),
    (0, express_validator_1.body)("date")
        .notEmpty()
        .withMessage("日付が必要です")
        .isISO8601()
        .withMessage("日付の形式が正しくありません"),
];
