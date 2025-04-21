import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
});

export const User: Model<IUser> = model("User", userSchema);
