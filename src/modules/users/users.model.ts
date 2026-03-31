import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
