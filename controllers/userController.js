const { default: mongoose } = require("mongoose");
const Point = require("../models/point")
const User = require("../models/user");
const sendEmail = require("../utils/sendmail");

// Lấy thông tin tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    fullname: req.body.fullname,
    img: req.body.img,
    roleName: req.body.roleName,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.phoneNumber) {
      user.phoneNumber = req.body.phoneNumber;
    }

    if (req.body.fullname) {
      user.fullname = req.body.fullname;
    }

    if (req.body.img) {
      user.img = req.body.img;
    }

    if (req.body.roleName) {
      user.roleName = req.body.roleName;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//thêm điểm cho người dùng
exports.updatePointUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.point) {
      const pointsToAdd = parseInt(req.body.point);
      user.point += pointsToAdd;
    }

    const pointId = req.body.pointId; // Lấy ID của "point" từ body của yêu cầu
    if (pointId) {
      const point = await Point.findById(pointId);
      if (!point) {
        return res.status(404).json({ message: "Point not found" });
      }
      point.status = "approved";
      await point.save();
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePointUserEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.point) {
      const pointsToAdd = parseInt(req.body.point);
      user.point += pointsToAdd;
    }

    const pointId = req.body.pointId; // Lấy ID của "point" từ body của yêu cầu
    if (pointId) {
      const point = await Point.findById(pointId);
      if (!point) {
        return res.status(404).json({ message: "Point not found" });
      }
      point.status = "approved";
      await point.save();
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//gửi điểm để admin xác nhận 
exports.createFromPoint = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = new Postings({
      title: req.body.title,
      description: req.body.description,
      buildings: req.body.buildings,
      rooms: req.body.rooms,
      userPosting: req.user.id,
      img: req.body.img,
    });
    await post.save();
    res.status(201).json({
      status: "Success",
      messages: "Post created successfully!",
      data: { post },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
// Xoá người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = false;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//get data theo status false
exports.getData = async (req, res) => {
  try {
    const users = await User.find({ status: false });
    res.status(200).json({
      status: "Success",
      messages: "Get users successfully!",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
//set status user thành true
exports.setUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      // { id: userId },
      mongoose.Types.ObjectId(userId),
      { status: true, roleName: "landlord" },
      { new: true } // trả về user sau khi đã update
    );
    if (!updatedUser || !updatedUser.status) {
      return res.status(404).json({
        status: "Fail",
        messages: "User not found or status is not true",
      });
    }
    // const statusMail = "registerSuccess";
    // await sendEmail(statusMail, updatedUser)
    res.status(200).json({
      status: "Success",
      messages: "User status updated successfully!",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

//delete User theo id
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        status: "Fail",
        messages: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      messages: "User deleted successfully!",
      data: {
        // user: deletedUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

exports.countUsers = async (req, res, next) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month) - 1; // Trừ đi 1 vì tháng trong JS bắt đầu từ 0
  const day = parseInt(req.query.day);
  const status = req.query.status;

  var startOfDay, endOfDay;
  if (year && month && day) { // Nếu truyền vào ngày
    startOfDay = new Date(year, month, day);
    endOfDay = new Date(year, month, day);
    endOfDay.setHours(23, 59, 59, 999);
  } else if (year && month) { // Nếu truyền vào tháng
    startOfDay = new Date(year, month, 1);
    endOfDay = new Date(year, month + 1, 0);
    endOfDay.setHours(23, 59, 59, 999);
  } else if (year) { // Nếu truyền vào năm
    startOfDay = new Date(year, 0, 1);
    endOfDay = new Date(year, 11, 31);
    endOfDay.setHours(23, 59, 59, 999);
  }

  const query = { createdAt: { $gte: startOfDay, $lte: endOfDay } }
  if (status) { // Nếu status được truyền vào
    query.status = status; // Thêm điều kiện lọc theo status
  }

  try {
    const count = await User.countDocuments(query);
    res.status(200).json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

