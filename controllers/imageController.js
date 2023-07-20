const Images = require("../models/image")

exports.createImages = async (req, res) => {
    try {

        const newImage = new Images({
            img: req.body.img, // Lấy đường dẫn từ trường img của req.body
            imgName :req.body.imgName
        });


        await newImage.save();
        res.status(201).json({
            status: "Success",
            message: "Room created successfully!",
            data: {
                newImage
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            message: err.message,
        });
    }
};
exports.getAllImages = async (req, res) => {
    try {
        const users = await Images.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};