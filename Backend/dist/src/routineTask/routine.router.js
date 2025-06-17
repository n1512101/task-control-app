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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const express_validator_1 = require("express-validator");
const routine_controller_1 = __importDefault(require("./routine.controller"));
const createRoutine_validator_1 = require("./validators/createRoutine.validator");
const verifyAccessToken_1 = __importDefault(require("../middlewares/verifyAccessToken"));
let RoutineRouter = class RoutineRouter {
    constructor(routineController) {
        this.routineController = routineController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // ルーティン作成API
        this.router.post("/create", verifyAccessToken_1.default, createRoutine_validator_1.createRoutineValidator, (req, res) => __awaiter(this, void 0, void 0, function* () {
            // result: バリデーション結果
            const result = (0, express_validator_1.validationResult)(req);
            if (result.isEmpty()) {
                yield this.routineController.createRoutine(req, res);
            }
            else {
                res.status(400).json(result.array());
            }
        }));
        // ルーティン取得API
        this.router.get("/", verifyAccessToken_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.routineController.getRoutines(req, res);
        }));
        // ルーティンを更新するAPI
        this.router.put("/", verifyAccessToken_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.routineController.updateRoutine(req, res);
        }));
        // ルーティンを削除するAPI
        this.router.delete("/", verifyAccessToken_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.routineController.deleteRoutine(req, res);
        }));
    }
};
RoutineRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(routine_controller_1.default)),
    __metadata("design:paramtypes", [routine_controller_1.default])
], RoutineRouter);
exports.default = RoutineRouter;
