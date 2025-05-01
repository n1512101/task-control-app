import { body } from "express-validator";

// サインアップAPIバリデーションチェック
export const signupValidator = [
  body("email")
    .notEmpty()
    .withMessage("メールアドレスを入力してください")
    .isEmail()
    .withMessage("正しいメールアドレスを入力してください")
    .trim(),
  body("name")
    .notEmpty()
    .withMessage("ユーザー名を入力してください")
    .isLength({ min: 3 })
    .withMessage("3文字以上入力してください")
    .isLength({ max: 20 })
    .withMessage("20文字以内で入力してください")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("パスワードを入力してください")
    .isLength({ min: 6 })
    .withMessage("6文字以上入力してください")
    .isLength({ max: 20 })
    .withMessage("20文字以内で入力してください")
    .trim(),
  body("confirm")
    .notEmpty()
    .withMessage("確認用パスワードを入力してください")
    .isLength({ min: 6 })
    .withMessage("6文字以上入力してください")
    .isLength({ max: 20 })
    .withMessage("20文字以内で入力してください")
    .trim()
    .custom((confirm, { req }) => confirm === req.body.password)
    .withMessage("パスワードが一致しません"),
];
