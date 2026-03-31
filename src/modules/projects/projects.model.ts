import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    ownerClerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
  },
  {
    collection: "projects",
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
