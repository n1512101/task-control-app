import mongoose from "mongoose";

// データベース接続関数
function dbConnect() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Cannot read environment variables.");
  }

  try {
    mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log("Connected to database.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default dbConnect;
