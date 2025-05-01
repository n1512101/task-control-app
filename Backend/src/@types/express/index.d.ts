import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // reqにuserプロパティーを追加する
    interface Request {
      user: JwtPayload;
    }
  }
}
