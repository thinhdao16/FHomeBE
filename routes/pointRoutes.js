const pointController = require("../controllers/pointController");
const authenticate = require("../middlewares/authenticate");
const express = require('express');
const router = express.Router();

router.get("/getformpoint", authenticate, pointController.getPoitn);
router.post("/postformpoint", authenticate, pointController.createPointUser)
router.delete("/deleteformpoint/:id", authenticate, pointController.deleteFormPoint)
module.exports = router
