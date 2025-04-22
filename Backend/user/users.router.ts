import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { IUser } from "./user.interface";
import UsersController from "./users.controller";

@injectable()
export default class UsersRouter {
  public router: Router;

  constructor(
    @inject(UsersController) private usersController: UsersController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", (req: Request, res: Response) => {
      // ログイン時の処理
    });

    this.router.post(
      "/signup",
      async (req: Request<{}, {}, IUser>, res: Response) => {
        // サインアップ処理
        this.usersController.signUp(req, res);
      }
    );
  }
}
