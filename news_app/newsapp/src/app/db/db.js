import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connect () {
  try {
    await mongoose.connect(process.env.mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}