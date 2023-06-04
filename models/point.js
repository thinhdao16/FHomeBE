const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        point: {
            type: Number, min :0
        }
    },
    { timestamps: true }
);

const Point = mongoose.model("Points", PointSchema);

module.exports = Point;
