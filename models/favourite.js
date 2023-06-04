const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Postings",
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorites", FavoriteSchema);

module.exports = Favorite;
