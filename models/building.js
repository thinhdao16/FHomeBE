const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
    {
        buildingName: { type: String },
        address: { type: String },
        status : {type: Boolean, default: true}
    },
    { timestamps: true },
);

const Buildings = mongoose.model("Buildings", buildingSchema);

module.exports = Buildings;