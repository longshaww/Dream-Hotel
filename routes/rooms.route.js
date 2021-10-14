const express = require("express");
const controller = require("../controllers/room.controller");
const router = express.Router();
const validate = require("../validate/room.validate");
router.get("/", controller.roomHome);

router.get("/search", controller.searchRoom);

router.get("/create", controller.createRoomPug);
router.post(
	"/create",
	validate.createRoomValidation,
	controller.createRoomValidation
);

router.get("/:id", controller.viewRoom);

router.post("/delete/:id", controller.deleteRoom);

router.get("/:id/edit", controller.editRoomPug);

router.post("/:id/edit", controller.editRoomHandling);

module.exports = router;
