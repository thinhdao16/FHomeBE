const contractController = require("../controllers/contractController");
const authenticate = require("../middlewares/authenticate");
const uploadImage = require("../middlewares/uploadImage");
const express = require('express');
const router = express.Router();

router.get("/getContract", contractController.getContract);
router.post("/postContract",uploadImage, contractController.createContractUser)
router.put("/rejectedContract/:id", contractController.rejectedContract)
router.delete("/deleteContract/:id", contractController.deleteFormContract)
module.exports = router
