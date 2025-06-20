import { Request, Response } from "express";
import { injectable } from "inversify";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { ILoginUser, IUser } from "./user.interface";
import { User } from "../models/user.model";
import { salt } from "../config/utils";
import { IRefreshToken, RefreshToken } from "../models/refreshToken.model";

@injectable()
export default class UsersController {
  constructor() {}

  // デバイスIDを生成する関数
  private generateDeviceId(req: Request): string {
    // User-AgentとIPアドレスを組み合わせてデバイスIDを生成
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || "";
    const deviceString = `${userAgent}-${ip}`;
    return crypto.createHash("sha256").update(deviceString).digest("hex");
  }

  // ログイン時の処理
  public async login(req: Request<{}, {}, ILoginUser>, res: Response) {
    // 余分なデータがあった場合除去する
    const validateData: ILoginUser = matchedData(req);

    try {
      const { email, password } = validateData;

      // emailが存在するか
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "ユーザーが存在しません" });
      }

      // パスワードが合っているかチェック
      const result = bcrypt.compareSync(password, user.password);
      if (!result) {
        return res.status(401).json({ message: "パスワードが間違っています" });
      }

      // デバイスIDを生成
      const deviceId = this.generateDeviceId(req);

      // アクセストークン生成
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY as string) }
      );
      // リフレッシュトークン生成
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY as string) }
      );

      // 既存の同じデバイスのリフレッシュトークンを削除
      await RefreshToken.deleteOne({ userId: user._id, deviceId });

      // refreshTokenをデータベースに保存する
      const newRefreshToken = new RefreshToken<IRefreshToken>({
        userId: user._id,
        refreshToken,
        deviceId,
      });
      await newRefreshToken.save();

      // httponly cookieにrefreshTokenを保存する
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY as string) * 1000,
      });

      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // サインアップ時の処理
  public async signUp(req: Request<{}, {}, IUser>, res: Response) {
    // 余分なデータがあった場合除去する
    const validateData: IUser = matchedData(req);

    try {
      const { name, password, email } = validateData;

      // email重複チェック
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(403)
          .json({ message: "このメールアドレスはすでに存在しています" });
      }

      // パスワード暗号化
      const hashPassword = bcrypt.hashSync(password, salt);

      // 新規ユーザー作成
      const newUser = new User({ email, password: hashPassword, name });
      await newUser.save();

      res.status(201).json({ message: "サインアップ成功！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ログアウト時の処理
  public async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new Error();

      const user = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      // デバイスIDを生成
      const deviceId = this.generateDeviceId(req);

      // リフレッシュトークンを破棄する
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });

      // 特定のデバイスのリフレッシュトークンのみを削除
      await RefreshToken.deleteOne({ userId: user.id, deviceId });
      res.status(200).json({ message: "ログアウト成功！" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
