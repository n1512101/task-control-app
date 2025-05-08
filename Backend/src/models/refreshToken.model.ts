import { model, Model, Schema, Types } from "mongoose";

export interface IRefreshToken {
  userId: Types.ObjectId;
  refreshToken: string;
  createdAt?: Date;
}

const refreshTokenSchema: Schema<IRefreshToken> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
    expires: parseInt(process.env.REFRESH_TOKEN_EXPIRY as string),
  },
});

export const RefreshToken: Model<IRefreshToken> = model(
  "RefreshToken",
  refreshTokenSchema
);
