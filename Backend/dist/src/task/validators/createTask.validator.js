"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
const dayjs_1 = __importDefault(require("dayjs"));
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
    (0, express_validator_1.body)("startDate")
        .notEmpty()
        .withMessage("日付が必要です")
        .isISO8601()
        .withMessage("日付の形式が正しくありません"),
    (0, express_validator_1.body)("endDate")
        .notEmpty()
        .withMessage("日付が必要です")
        .isISO8601()
        .withMessage("日付の形式が正しくありません")
        .custom((value, { req }) => {
        if (!(0, dayjs_1.default)(value).isAfter((0, dayjs_1.default)(req.body.startDate))) {
            throw new Error("開始日時と終了日時が不適切です");
        }
        return true;
    }),
    (0, express_validator_1.body)("isAllDay")
        .notEmpty()
        .withMessage("終日かどうかが必要です")
        .isBoolean()
        .withMessage("終日かどうかの値が間違っています"),
];
