const Point = require("../models/point");
exports.getPoitn = async (req, res) => {
    try {
        const point = await Point.find({}).populate(
            "user"
        );
        res.status(200).json({
            status: "Success",
            messages: "Get favourite successfully!",
            data: { point },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            messages: err.message,
        });
    }
};
exports.createPointUser = async (req, res) => {
    try {
        const userId = req.user.id; // Thay "user" bằng tên trường từ form
        const pointId = req.body.point; // Thay "point" bằng tên trường từ form


        const existingPoint = await Point.findOne({ user: userId, point: pointId });
        if (existingPoint) {
            return res.status(400).json({
                status: "Fail",
                messages: "This post has already been pointed by the user",
            });
        }

        const point = new Point({
            user: userId,
            point: pointId,
        });

        await point.save();

        res.status(201).json({
            status: "Success",
            messages: "Point post created successfully!",
            data: { point },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            messages: err.message,
        });
    }
}
exports.deleteFormPoint = async (req, res) => {
    try {
        const point = await Point.findById(req.params.id);
        if (!point) {
            return res.status(404).json({ message: "Point not found" });
        }
        await point.remove(); // Remove the point from the database
        res.status(200).json({ message: "Point deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
