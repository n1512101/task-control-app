import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// refreshTokenが有効かを確認するミドルウェア
const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  // refreshTokenがない場合
  if (!refreshToken) {
    res.status(401).json({ message: "リフレッシュトークンが必要です" });
    return;
  }

  // refreshToken認証
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "リフレッシュトークンが無効です" });
  }
};

export default verifyRefreshToken;
