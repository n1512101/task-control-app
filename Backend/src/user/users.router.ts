import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { IUser } from "./user.interface";
import UsersController from "./users.controller";
import { signupValidator } from "./validators/signup.validator";
import { Result, validationResult } from "express-validator";

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
      signupValidator,
      async (req: Request<{}, {}, IUser>, res: Response) => {
        // result: バリデーション結果
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
          // バリデーションチェックok, サインアップ処理
          const response = await this.usersController.signUp(req, res);
          res.json(response);
        } else {
          res.status(400).json(result.array());
        }
      }
    );
  }
}
