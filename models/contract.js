const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        fullname: {
            type: String,
        },
        description: {
            type: String,
        },
        img: { type: String, },
        status: {
            type: String,
            enum: ["approved", "rejected", "pending"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Contract = mongoose.model("Contracts", ContractSchema);

module.exports = Contract;
