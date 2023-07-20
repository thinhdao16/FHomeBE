const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
    {
        img: { type: String },
        imgName: { type: String },
    },
    { timestamps: true }
);

const Image = mongoose.model("Images", ImageSchema);

module.exports = Image;
