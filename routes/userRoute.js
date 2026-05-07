const express = require("express");

const {
    getCurrentUser,
    getAllMembers
} = require("../controllers/userController");

const { isAuth } = require("../middlewares/isAuth");

const userRoute = express.Router();

userRoute.get(
    "/current",
    isAuth,
    getCurrentUser
);

userRoute.get(
    "/members",
    isAuth,
    getAllMembers
);

module.exports = userRoute;