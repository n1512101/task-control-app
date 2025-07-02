"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["study", "job", "recreation", "exercise"],
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
    },
    status: {
        type: String,
        enum: ["pending", "done"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        index: { expires: parseInt(process.env.TASK_EXPIRY) },
    },
    endDate: {
        type: Date,
        required: true,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    reminderCount: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0,
        required: true,
    },
    nextReminderAt: {
        type: Date,
        default: null,
    },
    isAllDay: {
        type: Boolean,
        required: true,
    },
});
exports.Task = (0, mongoose_1.model)("Tasks", taskSchema);
