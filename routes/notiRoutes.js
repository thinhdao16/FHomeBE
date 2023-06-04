const noti = require("../controllers/pushNotification");
const authenticate = require("../middlewares/authenticate");
const express = require('express');
const router = express.Router();

router.post("/pushNoti", noti.sendNotification)

module.exports = router;