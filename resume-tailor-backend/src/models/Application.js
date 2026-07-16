import mongoose from "mongoose";

const bulletSchema = new mongoose.Schema(
  {
    original: { type: String, required: true },
    tailored: { type: String, required: true },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Saved", "Applied", "Interviewing", "Offer", "Rejected"],
      default: "Saved",
    },
    matchScore: { type: Number, min: 0, max: 100, default: null },
    jobDescription: { type: String, default: "" },
    resumeSnapshot: { type: String, default: "" },
    savedBullets: { type: [bulletSchema], default: [] },
    matches: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    date: { type: String }, // yyyy-mm-dd, set by client at save time
  },
  { timestamps: true }
);

applicationSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Application", applicationSchema);
