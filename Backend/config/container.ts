import { Container } from "inversify";
import UsersRouter from "../user/users.router";

// inversifyコンテナを作成
const container: Container = new Container();

// コンテナにクラスを登録する
container.bind(UsersRouter).toSelf().inSingletonScope();

export default container;
