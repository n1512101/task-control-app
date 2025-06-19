"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// refreshTokenが有効かを確認するミドルウェア
const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken:", refreshToken);
    // refreshTokenがない場合
    if (!refreshToken) {
        res.status(401).json({ message: "リフレッシュトークンが必要です" });
        return;
    }
    // refreshToken認証
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "リフレッシュトークンが無効です" });
    }
};
exports.default = verifyRefreshToken;
