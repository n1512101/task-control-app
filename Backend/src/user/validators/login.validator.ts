import { body } from "express-validator";

// サインアップAPIバリデーションチェック
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("メールアドレスを入力してください")
    .isEmail()
    .withMessage("正しいメールアドレスを入力してください")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("パスワードを入力してください")
    .isLength({ min: 6 })
    .withMessage("6文字以上入力してください")
    .isLength({ max: 20 })
    .withMessage("20文字以内で入力してください")
    .trim(),
];
