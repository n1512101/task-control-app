import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Result, validationResult } from "express-validator";
import { ILoginUser, IUser } from "./user.interface";
import UsersController from "./users.controller";
import { signupValidator } from "./validators/signup.validator";
import { loginValidator } from "./validators/login.validator";

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
    // ログインAPI
    this.router.post(
      "/login",
      loginValidator,
      async (req: Request<{}, {}, ILoginUser>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          // バリデーションチェックokの場合, ログイン処理を実行
          await this.usersController.login(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );

    // サインアップAPI
    this.router.post(
      "/signup",
      signupValidator,
      async (req: Request<{}, {}, IUser>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          // バリデーションチェックokの場合, サインアップ処理を実行
          await this.usersController.signUp(req, res);
        } else {
          res.status(400).json(result.array());
        }
      }
    );

    // ログアウトAPI
    this.router.post("/logout", async (req: Request, res: Response) => {
      await this.usersController.logout(req, res);
    });
  }
}
