"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineTask = void 0;
const mongoose_1 = require("mongoose");
const routineSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User",
    },
    repeatType: {
        type: String,
        enum: ["daily", "weekly"],
        required: true,
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
});
exports.RoutineTask = (0, mongoose_1.model)("RoutineTasks", routineSchema);
