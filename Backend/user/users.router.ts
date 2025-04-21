import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export default class UsersRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", (req, res) => {
      // ログイン時の処理
    });
  }
}
