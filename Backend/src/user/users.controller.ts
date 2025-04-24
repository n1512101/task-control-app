import { Request, Response } from "express";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { injectable } from "inversify";
import { matchedData } from "express-validator";

@injectable()
export default class UsersController {
  constructor() {}

  public async signUp(req: Request<{}, {}, IUser>, res: Response) {
    const validateData: IUser = matchedData(req);

    // サインアップ時の処理
    try {
      const { name, password, email } = validateData;

      // email重複チェック
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(403).json("Email is already registered.");
        return;
      }

      // 新規ユーザー作成
      const newUser = new User({ email, password: password, name });
      await newUser.save();

      res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}
