"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// accessTokenが有効かを確認するミドルウェア
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // authHeaderが存在しないもしくは形式が正しくない場合
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        res.status(401).json({ message: "アクセストークンが必要です" });
        return;
    }
    const token = authHeader.split(" ")[1];
    // accessToken認証
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "アクセストークンが無効です" });
    }
};
exports.default = verifyAccessToken;
