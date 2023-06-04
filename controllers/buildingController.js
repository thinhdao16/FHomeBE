const Buildings = require("../models/building");

const getAllBuildings = async (req, res) => {
    try {
      const buildings = await Buildings.find({status: true});
      res.status(200).json({
        status: "Success",
        messages: "Get buildings successfully!",
        data: { buildings },
      });
    } catch (err) {
      res.status(500).json({
        status: "Fail",
        messages: err.message,
      });
    }
  };

  module.exports = {
    getAllBuildings
  };