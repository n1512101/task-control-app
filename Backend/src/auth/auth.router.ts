import { Request, Response, Router } from "express";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import verifyAccessToken from "../middlewares/verifyAccessToken";
import verifyRefreshToken from "../middlewares/verifyRefreshToken";
import { IRefreshToken, RefreshToken } from "../models/refreshToken.model";

@injectable()
export default class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  // デバイスIDを生成する関数
  private generateDeviceId(req: Request): string {
    // User-AgentとIPアドレスを組み合わせてデバイスIDを生成
    const userAgent = req.headers["user-agent"] || "";

    // IPアドレス取得
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      "";

    // IPアドレスが配列の場合は最初の要素を使用
    const clientIp = Array.isArray(ip) ? ip[0] : ip;

    const deviceString = `${userAgent}-${clientIp}`;
    return crypto.createHash("sha256").update(deviceString).digest("hex");
  }

  private initializeRoutes() {
    // accessToken認証API
    this.router.get(
      "/verify-token",
      verifyAccessToken,
      (req: Request, res: Response) => {
        res.status(200).json({ message: "アクセストークン認証成功！" });
      }
    );

    // refreshToken認証API
    this.router.post(
      "/refresh-token",
      verifyRefreshToken,
      async (req: Request, res: Response) => {
        try {
          // デバイスIDを生成
          const deviceId = this.generateDeviceId(req);

          // データベース内からユーザーを確認
          const token = await RefreshToken.findOne({
            userId: req.user.id,
            refreshToken: req.cookies.refreshToken,
            deviceId,
          });
          if (!token) {
            throw new Error();
          }

          // 新しいアクセストークンを発行する
          const accessToken = jwt.sign(
            { id: req.user.id },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY as string) }
          );

          // 新しいリフレッシュトークンを発行し、保存する
          const refreshToken = jwt.sign(
            { id: req.user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY as string) }
          );

          const newRefreshToken = new RefreshToken<IRefreshToken>({
            userId: req.user.id,
            refreshToken,
            deviceId,
          });
          // 古いリrefreshTokenを削除し、新しいrefreshTokenを保存
          await Promise.all([token.deleteOne(), newRefreshToken.save()]);

          // クッキーを更新する
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY as string) * 1000,
          });

          res.status(200).json({ accessToken });
        } catch (error) {
          res.status(401).json({ message: "リフレッシュトークンが無効です" });
        }
      }
    );
  }
}
