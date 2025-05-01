import { Container } from "inversify";
import UsersRouter from "../user/users.router";
import UsersController from "../user/users.controller";
import AuthRouter from "../auth/auth.router";

// inversifyコンテナを作成
const container: Container = new Container();

// コンテナにクラスを登録する
container.bind(UsersRouter).toSelf().inSingletonScope();
container.bind(UsersController).toSelf().inSingletonScope();
container.bind(AuthRouter).toSelf().inSingletonScope();

export default container;
