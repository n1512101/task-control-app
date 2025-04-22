import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

export const User: Model<IUser> = model("Users", userSchema);
