const favouriteController = require("../controllers/favouriteController");
const authenticate = require("../middlewares/authenticate");
const express = require('express');
const router = express.Router();

router.post("/createFavouritePost", authenticate, favouriteController.createFavouritePosting);

router.get("/getFavouriteByUser", authenticate, favouriteController.getFavouriteByUserId);

router.get("/getFavouriteByPost/:id", authenticate, favouriteController.getFavouriteByPost);

router.get("/getAllFavourite", authenticate, favouriteController.getFavourite);

router.delete("/deleteFavouritePost/:id", authenticate, favouriteController.deleteFavourite);

module.exports = router
