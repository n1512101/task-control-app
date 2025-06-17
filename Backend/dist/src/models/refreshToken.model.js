"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User",
    },
    refreshToken: {
        type: String,
        required: true,
    },
    /* expiresでTTLの時間を指定する */
    createdAt: {
        type: Date,
        default: Date.now,
        expires: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
    },
});
exports.RefreshToken = (0, mongoose_1.model)("RefreshToken", refreshTokenSchema);
