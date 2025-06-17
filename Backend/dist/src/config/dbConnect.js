"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// データベース接続関数
function dbConnect() {
    if (!process.env.DATABASE_URL) {
        throw new Error("Cannot read environment variables.");
    }
    try {
        mongoose_1.default.connect(process.env.DATABASE_URL, {
            dbName: process.env.DATABASE_NAME,
        });
        console.log("Connected to database.");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}
exports.default = dbConnect;
