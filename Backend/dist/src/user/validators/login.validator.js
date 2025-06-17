"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
// サインアップAPIバリデーションチェック
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("メールアドレスを入力してください")
        .isEmail()
        .withMessage("正しいメールアドレスを入力してください")
        .trim(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("パスワードを入力してください")
        .isLength({ min: 6 })
        .withMessage("6文字以上入力してください")
        .isLength({ max: 20 })
        .withMessage("20文字以内で入力してください")
        .trim(),
];
