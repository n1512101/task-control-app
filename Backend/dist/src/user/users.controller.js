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
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const utils_1 = require("../config/utils");
const refreshToken_model_1 = require("../models/refreshToken.model");
let UsersController = class UsersController {
    constructor() { }
    // ログイン時の処理
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 余分なデータがあった場合除去する
            const validateData = (0, express_validator_1.matchedData)(req);
            try {
                const { email, password } = validateData;
                // emailが存在するか
                const user = yield user_model_1.User.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: "ユーザーが存在しません" });
                }
                // パスワードが合っているかチェック
                const result = bcrypt_1.default.compareSync(password, user.password);
                if (!result) {
                    return res.status(401).json({ message: "パスワードが間違っています" });
                }
                // アクセストークン生成
                const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY) });
                // リフレッシュトークン生成
                const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY) });
                // refreshTokenをデータベースに保存する
                const newRefreshToken = new refreshToken_model_1.RefreshToken({
                    userId: user._id,
                    refreshToken,
                });
                yield newRefreshToken.save();
                // httponly cookieにrefreshTokenを保存する
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
                });
                res.status(200).json({ accessToken });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // サインアップ時の処理
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 余分なデータがあった場合除去する
            const validateData = (0, express_validator_1.matchedData)(req);
            try {
                const { name, password, email } = validateData;
                // email重複チェック
                const existingUser = yield user_model_1.User.findOne({ email });
                if (existingUser) {
                    return res
                        .status(403)
                        .json({ message: "このメールアドレスはすでに存在しています" });
                }
                // パスワード暗号化
                const hashPassword = bcrypt_1.default.hashSync(password, utils_1.salt);
                // 新規ユーザー作成
                const newUser = new user_model_1.User({ email, password: hashPassword, name });
                yield newUser.save();
                res.status(201).json({ message: "サインアップ成功！" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // ログアウト時の処理
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken)
                    throw new Error();
                const user = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                // リフレッシュトークンを破棄する
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
                yield refreshToken_model_1.RefreshToken.deleteOne({ userId: user.id });
                res.status(200).json({ message: "ログアウト成功！" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
};
UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UsersController);
exports.default = UsersController;
