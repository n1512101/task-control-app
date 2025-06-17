"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addRoutes;
const container_1 = __importDefault(require("./container"));
const users_router_1 = __importDefault(require("../user/users.router"));
const auth_router_1 = __importDefault(require("../auth/auth.router"));
const routine_router_1 = __importDefault(require("../routineTask/routine.router"));
const task_router_1 = __importDefault(require("../task/task.router"));
// ルートを追加する関数
function addRoutes(app) {
    // DIコンテナから各コンテナのインスタンスを取得
    const usersRouter = container_1.default.get(users_router_1.default);
    const authRouter = container_1.default.get(auth_router_1.default);
    const routineRouter = container_1.default.get(routine_router_1.default);
    const taskRouter = container_1.default.get(task_router_1.default);
    // routerを登録する
    app.use("/user", usersRouter.router);
    app.use("/auth", authRouter.router);
    app.use("/routine", routineRouter.router);
    app.use("/task", taskRouter.router);
}
