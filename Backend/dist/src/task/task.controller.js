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
const task_model_1 = require("../models/task.model");
const dayjs_1 = __importDefault(require("dayjs"));
let TaskController = class TaskController {
    constructor() { }
    // タスク作成時の処理
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 余分なデータがあった場合除去する
            const validateData = (0, express_validator_1.matchedData)(req);
            try {
                const newTask = new task_model_1.Task(Object.assign(Object.assign({}, validateData), { userId: req.user.id }));
                yield newTask.save();
                res.status(200).json("タスク作成成功！");
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // タスク取得時の処理
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const tasks = yield task_model_1.Task.find({
                    userId: req.user.id,
                    startDate: { $gte: today, $lt: tomorrow },
                }).select(["_id", "category", "description", "status"]);
                res.status(200).json({ tasks });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // 全てのタスクを取得時の処理
    getAllTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield task_model_1.Task.find({
                    userId: req.user.id,
                }).select([
                    "_id",
                    "category",
                    "description",
                    "status",
                    "startDate",
                    "endDate",
                    "isAllDay",
                ]);
                res.status(200).json({ tasks });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // タスクを更新する際の処理
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, description, status, category } = req.body;
                // 更新対象フィールド
                const updateFields = {};
                if (description !== undefined)
                    updateFields.description = description;
                if (status !== undefined) {
                    updateFields.status = status;
                    if (status === "done") {
                        updateFields.completedAt = (0, dayjs_1.default)().format("YYYY-MM-DD");
                        if (category === "study") {
                            updateFields.nextReminderAt = (0, dayjs_1.default)()
                                .add(1, "day")
                                .format("YYYY-MM-DD");
                        }
                    }
                    else {
                        updateFields.completedAt = null;
                        if (category === "study") {
                            updateFields.nextReminderAt = null;
                            updateFields.reminderCount = 0;
                        }
                    }
                }
                if (Object.keys(updateFields).length === 0) {
                    return res
                        .status(400)
                        .json({ message: "更新対象が指定されていません" });
                }
                const result = yield task_model_1.Task.updateOne({ _id }, { $set: updateFields });
                if (!result.matchedCount) {
                    return res.status(404).json({ message: "該当するタスクはありません" });
                }
                res.status(200).json({ message: "タスク更新成功！" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    //タスクを削除する際の処理
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                if (!_id) {
                    return res
                        .status(400)
                        .json({ message: "削除対象が指定されていません" });
                }
                const result = yield task_model_1.Task.deleteOne({ _id });
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
TaskController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TaskController);
exports.default = TaskController;
