const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const validate = require("../validate/user.validate");
const upload = require("../utils/multer");
const { adminRequire } = require("../middlewares/auth.middleware");
router.get("/", adminRequire, controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.get("/:id", controller.getID);

router.post(
	"/create",
	upload.single("avatar"),
	validate.postCreate,
	controller.postCreate
);

router.get("/:id/edit", controller.editUser);

router.put("/:id/edit", upload.single("avatar"), controller.editUserHandling);

router.delete("/:id/delete", controller.deleteUser);

module.exports = router;
