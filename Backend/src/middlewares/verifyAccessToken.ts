import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// accessTokenが有効かを確認するミドルウェア
const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // authHeaderが存在しないもしくは形式が正しくない場合
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "アクセストークンが必要です" });
    return;
  }

  const token = authHeader.split(" ")[1];

  // accessToken認証
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "アクセストークンが無効です" });
  }
};

export default verifyAccessToken;
