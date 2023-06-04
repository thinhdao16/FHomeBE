"use strict";

var firebase = require("firebase");

var admin = require("firebase-admin");

var Multer = require("multer"); // Initialize Firebase app


firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "<your-storage-bucket-name>"
}); // Create a Multer instance for handling file uploads

var upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB

  }
}); // Define a route for handling file uploads

app.post("/api/upload", upload.single("file"), function (req, res) {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  var bucket = admin.storage().bucket();
  var blob = bucket.file(req.file.originalname);
  var blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  blobStream.on("error", function (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  });
  blobStream.on("finish", function () {
    var publicUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(blob.name);
    res.status(200).send(publicUrl);
  });
  blobStream.end(req.file.buffer);
});