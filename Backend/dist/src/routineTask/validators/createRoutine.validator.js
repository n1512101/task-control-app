"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutineValidator = void 0;
const express_validator_1 = require("express-validator");
// ルーティン作成APIバリデーションチェック
exports.createRoutineValidator = [
    (0, express_validator_1.body)("repeatType")
        .notEmpty()
        .withMessage("ルーティンのタイプが必要です")
        .isIn(["weekly", "daily"])
        .withMessage("タイプの値が間違っています"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("ルーティンのカテゴリーが必要です")
        .isIn(["study", "job", "recreation", "exercise"])
        .withMessage("カテゴリーの値が間違っています"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("ルーティンの内容が必要です")
        .isLength({ min: 1 })
        .withMessage("ルーティンの内容が最低1文字必要です")
        .trim(),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("ルーティンの状態が必要です")
        .isIn(["pending"])
        .withMessage("状態の値が間違っています"),
];
