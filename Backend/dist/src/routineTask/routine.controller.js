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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const routineTask_model_1 = require("../models/routineTask.model");
let RoutineController = class RoutineController {
    constructor() { }
    // ルーティン作成時の処理
    createRoutine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 余分なデータがあった場合除去する
            const validateData = (0, express_validator_1.matchedData)(req);
            try {
                const newRoutine = new routineTask_model_1.RoutineTask(Object.assign(Object.assign({}, validateData), { userId: req.user.id }));
                yield newRoutine.save();
                res.status(200).json("ルーティン作成成功！");
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // ルーティン取得時の処理
    getRoutines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield routineTask_model_1.RoutineTask.find({
                    userId: req.user.id,
                }).select(["_id", "repeatType", "category", "description", "status"]);
                res.status(200).json(tasks);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // ルーティン更新時の処理
    updateRoutine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, description, status } = req.body;
                // 更新対象フィールド
                const updateFields = {};
                if (description !== undefined)
                    updateFields.description = description;
                if (status !== undefined)
                    updateFields.status = status;
                if (Object.keys(updateFields).length === 0) {
                    return res
                        .status(400)
                        .json({ message: "更新対象が指定されていません" });
                }
                const result = yield routineTask_model_1.RoutineTask.updateOne({ _id }, { $set: updateFields });
                if (!result.matchedCount) {
                    return res
                        .status(404)
                        .json({ message: "該当するルーティンはありません" });
                }
                res.status(200).json({ message: "ルーティン更新成功！" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // ルーティン削除時の処理
    deleteRoutine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                if (!_id) {
                    return res
                        .status(400)
                        .json({ message: "削除対象が指定されていません" });
                }
                const result = yield routineTask_model_1.RoutineTask.deleteOne({ _id });
                if (!result.deletedCount) {
                    return res.status(404).json({ message: "削除対象が存在しません" });
                }
                res.status(200).json({ message: "ルーティンを削除しました！" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
};
RoutineController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RoutineController);
exports.default = RoutineController;
