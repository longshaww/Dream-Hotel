const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.get("/:id", controller.getID);

router.post("/create", controller.postCreate);
module.exports = router;
