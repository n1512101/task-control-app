"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const users_router_1 = __importDefault(require("../user/users.router"));
const users_controller_1 = __importDefault(require("../user/users.controller"));
const auth_router_1 = __importDefault(require("../auth/auth.router"));
const routine_router_1 = __importDefault(require("../routineTask/routine.router"));
const routine_controller_1 = __importDefault(require("../routineTask/routine.controller"));
const task_router_1 = __importDefault(require("../task/task.router"));
const task_controller_1 = __importDefault(require("../task/task.controller"));
// inversifyコンテナを作成
const container = new inversify_1.Container();
// コンテナにクラスを登録する
container.bind(users_router_1.default).toSelf().inSingletonScope();
container.bind(users_controller_1.default).toSelf().inSingletonScope();
container.bind(auth_router_1.default).toSelf().inSingletonScope();
container.bind(routine_router_1.default).toSelf().inSingletonScope();
container.bind(routine_controller_1.default).toSelf().inSingletonScope();
container.bind(task_router_1.default).toSelf().inSingletonScope();
container.bind(task_controller_1.default).toSelf().inSingletonScope();
exports.default = container;
