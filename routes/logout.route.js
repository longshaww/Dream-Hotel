const express = require("express");
const controller = require("../controllers/logout.controller");
const router = express.Router();

router.get("/", controller.logOut);

module.exports = router;
