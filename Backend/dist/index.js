"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./src/config/dbConnect"));
const routes_config_1 = __importDefault(require("./src/config/routes.config"));
const reviewReminder_1 = __importDefault(require("./src/regularProcessing/reviewReminder"));
const initializeRoutines_1 = __importDefault(require("./src/regularProcessing/initializeRoutines"));
// データベース接続
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// appにrouterを定義する
(0, routes_config_1.default)(app);
// Reactアプリのホスティング設定
const root = path_1.default.join(__dirname, "public");
app.use(express_1.default.static(root));
// SPA対応：すべてのその他のリクエストをindex.htmlにフォールバック
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(root, "index.html"));
});
// 定期的にリマインダーメール送信
(0, reviewReminder_1.default)();
// 毎日0時にルーティンを初期化する
(0, initializeRoutines_1.default)();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
