import { Model, model, Schema } from "mongoose";
import { IRefreshToken } from "./refreshToken.interface";

const refreshTokenSchema: Schema<IRefreshToken> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "User id is required."],
  },
  refreshToken: {
    type: String,
    required: [true, "Refresh token is required."],
  },
  expiresAt: {
    type: Date,
    required: [true, "Expire time is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RefreshToken: Model<IRefreshToken> = model(
  "RefreshToken",
  refreshTokenSchema
);
