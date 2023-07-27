const Contract = require("../models/contract");
exports.getContract = async (req, res) => {
    try {
        const contract = await Contract.find({})
        res.status(200).json({
            status: "Success",
            messages: "Get favourite successfully!",
            data: { contract },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            messages: err.message,
        });
    }
};
exports.createContractUser = async (req, res) => {
    try {
        const emailUser = req.body.email
        const fullnameUser = req.body.fullname
        const descriptionContract = req.body.description
        const imgContract = req.body.img;
        const existingContract = await Contract.findOne({ email: emailUser, status: "pending" });
        if (existingContract) {
            return res.status(400).json({
                status: "Fail",
                messages: "This post has already been contract by the user",
            });
        }

        const contract = new Contract({
            email: emailUser,
            fullname: fullnameUser,
            description : descriptionContract,
            img: imgContract,
        });
        await contract.save();

        res.status(201).json({
            status: "Success",
            messages: "Contract post created successfully!",
            data: { contract },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            messages: err.message,
        });
    }
}
exports.rejectedContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        contract.status = "rejected";
        await contract.save(); // Lưu lại điểm đã chỉnh sửa
        res.status(200).json({ message: "Contract status updated to rejected" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFormContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "contract not found" });
        }
        await contract.remove(); // Remove the point from the database
        res.status(200).json({ message: "contract deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};