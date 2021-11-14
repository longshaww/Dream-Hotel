const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const validate = require("../validate/user.validate");
const upload = require("../utils/multer");
// const cloudinary = require("../utils/cloudinary");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);
// router.get("/cookie", (req, res) => {
// 	res.cookie("user-id", 123456);
// 	res.send("Hello");
// });
router.get("/:id", controller.getID);

router.post(
	"/create",
	upload.single("avatar"),
	validate.postCreate,
	controller.postCreate
);

module.exports = router;
