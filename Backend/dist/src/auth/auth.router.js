"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const verifyAccessToken_1 = __importDefault(require("../middlewares/verifyAccessToken"));
const verifyRefreshToken_1 = __importDefault(require("../middlewares/verifyRefreshToken"));
const refreshToken_model_1 = require("../models/refreshToken.model");
let AuthRouter = class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    // デバイスIDを生成する関数
    generateDeviceId(req) {
        // User-AgentとIPアドレスを組み合わせてデバイスIDを生成
        const userAgent = req.headers["user-agent"] || "";
        const ip = req.ip || "";
        const deviceString = `${userAgent}-${ip}`;
        return crypto_1.default.createHash("sha256").update(deviceString).digest("hex");
    }
    initializeRoutes() {
        // accessToken認証API
        this.router.get("/verify-token", verifyAccessToken_1.default, (req, res) => {
            res.status(200).json({ message: "アクセストークン認証成功！" });
        });
        // refreshToken認証API
        this.router.post("/refresh-token", verifyRefreshToken_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // デバイスIDを生成
                const deviceId = this.generateDeviceId(req);
                // データベース内からユーザーを確認
                const token = yield refreshToken_model_1.RefreshToken.findOne({
                    userId: req.user.id,
                    refreshToken: req.cookies.refreshToken,
                    deviceId,
                });
                if (!token) {
                    throw new Error();
                }
                // 新しいアクセストークンを発行する
                const accessToken = jsonwebtoken_1.default.sign({ id: req.user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY) });
                // 現在のリフレッシュトークンを破棄する
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
                    domain: "onrender.com",
                });
                yield token.deleteOne();
                // 新しいリフレッシュトークンを発行し、保存する
                const refreshToken = jsonwebtoken_1.default.sign({ id: req.user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY) });
                const newRefreshToken = new refreshToken_model_1.RefreshToken({
                    userId: req.user.id,
                    refreshToken,
                    deviceId,
                });
                yield newRefreshToken.save();
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
                    domain: "onrender.com",
                    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
                });
                res.status(200).json({ accessToken });
            }
            catch (error) {
                res.status(401).json({ message: "リフレッシュトークンが無効です" });
            }
        }));
    }
};
AuthRouter = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AuthRouter);
exports.default = AuthRouter;
