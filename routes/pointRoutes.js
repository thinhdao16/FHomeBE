const pointController = require("../controllers/pointController");
const authenticate = require("../middlewares/authenticate");
const express = require('express');
const router = express.Router();

router.get("/getformpoint", authenticate, pointController.getPoitn);

router.post("/postformpoint", authenticate, pointController.createPointUser)

module.exports = router
