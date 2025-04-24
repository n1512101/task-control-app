import { checkSchema } from "express-validator";

// サインアップAPIにおけるreq.bodyのバリデーション
export const signupValidator = checkSchema({
  email: {
    in: "body",
    isEmail: true,
    notEmpty: true,
    errorMessage: "Must be a valid email.",
    trim: true,
  },
  password: {
    in: "body",
    notEmpty: true,
    errorMessage: "Must be a valid password",
  },
  name: {
    in: "body",
    notEmpty: true,
    errorMessage: "Must be a valid name.",
  },
});
