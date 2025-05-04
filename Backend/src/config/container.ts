import { Container } from "inversify";
import UsersRouter from "../user/users.router";
import UsersController from "../user/users.controller";
import AuthRouter from "../auth/auth.router";
import RoutineRouter from "../routineTask/routine.router";
import RoutineController from "../routineTask/routine.controller";

// inversifyコンテナを作成
const container: Container = new Container();

// コンテナにクラスを登録する
container.bind(UsersRouter).toSelf().inSingletonScope();
container.bind(UsersController).toSelf().inSingletonScope();
container.bind(AuthRouter).toSelf().inSingletonScope();
container.bind(RoutineRouter).toSelf().inSingletonScope();
container.bind(RoutineController).toSelf().inSingletonScope();

export default container;
