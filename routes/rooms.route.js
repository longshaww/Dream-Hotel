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
router.get("/checkin", controller.checkInForm);

router.post("/checkin", controller.postCheckIn);

router.get("/history", controller.rentHistory);

router.get("/checkout", controller.checkOutForm);

router.post("/checkout", controller.postCheckOut);

router.get("/:id", controller.viewRoom);

router.delete("/:id", controller.deleteRoom);

router.get("/:id/edit", controller.editRoomPug);

router.put("/:id", controller.editRoomHandling);

module.exports = router;
