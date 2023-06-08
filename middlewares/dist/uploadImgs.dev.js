"use strict";

var multer = require("multer");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var path = require("path");

var _require2 = require("@google-cloud/storage"),
    Storage = _require2.Storage;

var serviceAccount = require("../config/serviceAccount.json"); // Khởi tạo Storage của Firebase


var storage = new Storage({
  projectId: "auth-fhome",
  keyFilename: path.join(__dirname, "../config/serviceAccount.json")
}); // Lấy reference đến bucket trong Firebase Storage

var bucket = storage.bucket("auth-fhome.appspot.com"); // Khởi tạo middleware upload ảnh với Multer

var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  // giới hạn kích thước file là 5MB
  fileFilter: function fileFilter(req, file, cb) {
    // Kiểm tra định dạng file
    var allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      var error = new Error("Invalid file type.");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }

    return cb(null, true);
  }
}).array("img", 10); // Sử dụng array để cho phép tải lên nhiều tệp
// Middleware upload ảnh

var uploadImgs = function uploadImgs(req, res, next) {
  upload(req, res, function _callee2(err) {
    var uploadPromises, uploadedImages;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!err) {
              _context2.next = 3;
              break;
            }

            console.log(err); // Nếu xảy ra lỗi trong quá trình upload, trả về lỗi 400

            return _context2.abrupt("return", res.status(400).json({
              status: "Fail",
              message: err.message
            }));

          case 3:
            if (!(!req.files || req.files.length === 0)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next());

          case 5:
            _context2.prev = 5;
            uploadPromises = req.files.map(function (file) {
              // Tạo đường dẫn trong Firebase Storage
              var filePath = "room/".concat(uuidv4()).concat(path.extname(file.originalname));
              var fileUpload = bucket.file(filePath); // Khởi tạo stream để upload file lên Firebase Storage

              var blobStream = fileUpload.createWriteStream({
                metadata: {
                  contentType: file.mimetype
                }
              });
              return new Promise(function (resolve, reject) {
                // Xử lý lỗi trong quá trình upload
                blobStream.on("error", function (error) {
                  console.log(error);
                  reject(error);
                }); // Khi upload hoàn tất, gán đường dẫn vào trường img trong body của request

                blobStream.on("finish", function _callee() {
                  var file, expires, publicUrl;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          file = bucket.file(filePath); // Tạo một URL đã ký với thời gian hết hạn là 30 ngày

                          expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

                          _context.next = 4;
                          return regeneratorRuntime.awrap(file.getSignedUrl({
                            action: "read",
                            expires: expires
                          }));

                        case 4:
                          publicUrl = _context.sent;
                          resolve(publicUrl[0]);

                        case 6:
                        case "end":
                          return _context.stop();
                      }
                    }
                  });
                }); // Ghi dữ liệu vào stream và kết thúc stream

                blobStream.end(file.buffer);
              });
            }); // Đợi tất cả các tệp được tải lên hoàn thành

            _context2.next = 9;
            return regeneratorRuntime.awrap(Promise.all(uploadPromises));

          case 9:
            uploadedImages = _context2.sent;
            req.body.imgs = uploadedImages;
            next();
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](5);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              status: "Fail",
              message: "Something went wrong. Please try again later."
            }));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[5, 14]]);
  });
};

module.exports = uploadImgs;