const express = require("express");
const userController = require("../controllers/userController");
const authorize = require("../middlewares/authorize");
const authenticate = require("../middlewares/authenticate");
const uploadImage = require("../middlewares/uploadImage");
const router = express.Router();

// Thêm người dùng mới
router.post("/users", authorize(["admin"]), userController.createUser);

// Lấy thông tin tất cả người dùng
router.get("/getAllUsers", userController.getAllUsers);
router.get(
  "/getAllUsersAuthor",
  authenticate,
  authorize(["admin", "landlord"]),
  userController.getAllUsers
);

// Lấy thông tin một người dùng
router.get(
  "/users/:id",
  authorize(["admin", "landlord"]),
  userController.getUserById
);
router.get( "/userProfile/:id",  userController.getUserById);

router.put( "/userProfile/:id", uploadImage, userController.updateUser);

// Cập nhật thông tin người dùng
router.put(
  "/users/:id",
  authorize(["admin", "landlord"]),
  uploadImage,
  userController.updateUser
);

// Xóa người dùng
router.delete("/users/:id", authorize(["admin"]), userController.deleteUser);

router.get("/getUser", userController.getData);
//http://localhost:3000/getUser
router.put("/setUserStatus/:id", userController.setUserStatus);
//example http://localhost:3000/setUserStatus/63fc61ef617136555e017603

router.delete("/deleteUser/:id", userController.deleteUser);
//example http://localhost:3000/deleteUser/63fc6149d0db61d24a614b62


router.get("/countUser", userController.countUsers);

//plus point user
router.put("/pointplus/:id", authenticate, userController.updatePointUser)

module.exports = router;
