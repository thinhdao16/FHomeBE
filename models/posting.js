const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["draft", "approved", "rejected", "pending", "published"],
      default: "draft",
    },
    buildings: { type: mongoose.Schema.Types.ObjectId, ref: "Buildings" },
    rooms: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
    userPosting: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    img: { type: String },
    invoiceId: { type: String },
  },
  { timestamps: true }
);

const Postings = mongoose.model("Postings", postSchema);

module.exports = Postings;
