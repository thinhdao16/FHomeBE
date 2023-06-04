const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomName: {type: String},
        size: { type: Number, min: 0 },
        price: { type: Number, min: 0 },
        description: { type: String },
        img: { type: String },
        status: { type: Boolean, default: true },
        buildings: { type: mongoose.Schema.Types.ObjectId, ref: "Buildings" },
        users: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
    { timestamps: true }
);

const Rooms = mongoose.model("Rooms", roomSchema);

module.exports = Rooms;