const express = require("express");
const router = express.Router();
const paypal = require("../middlewares/paypal");
const Postings = require("../models/posting");

router.get("/invoices", async (req, res) => {
  paypal;
  try {
    const hoaDon = await paypal.createDraftInvoice(
      "Vinh tran",
      "tranvinh2499@gmail.com",
      "0123456789"
    );
    //lay hoa don id
    const hoaDonId = hoaDon.href.split("/")[6];

    console.log(hoaDonId, "hoa don id");

    res.status(200).json({
      msg: "tao hoa don thanh cong",
      data: hoaDon,
    });
  } catch (error) {
    console.log(error.response.data);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await paypal.checkPublishedPost();

    res.status(200).json({
      msg: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      mesaage: error.message,
    });
  }
});

module.exports = router;
