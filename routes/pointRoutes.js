const pointController = require("../controllers/pointController");
const authenticate = require("../middlewares/authenticate");
const uploadImage = require("../middlewares/uploadImage");
const express = require('express');
const router = express.Router();

router.get("/getformpoint", authenticate, pointController.getPoitn);
router.get("/getformpointEmail", pointController.getPoitnEmail);

router.post("/postformpoint", authenticate,uploadImage, pointController.createPointUser)

router.post("/postformpointEmail",uploadImage, pointController.createPointUserEmail)

router.put("/rejectedpoint/:id", authenticate, pointController.rejectedPoint)
router.delete("/deleteformpoint/:id", authenticate, pointController.deleteFormPoint)
module.exports = router
