const express = require("express");
const controller = require("../controllers/room.controller");
const router = express.Router();

router.get("/", controller.roomHome);

router.get("/search", controller.searchRoom);

router.get("/create", controller.createRoomPug);
router.post("/create", controller.createRoomValidation);

router.get("/:id", controller.viewRoom);
router.post("/delete/:id", controller.deleteRoom);

router.get("/:id/edit", controller.editRoomPug);

router.post("/:id/edit", controller.editRoomHandling);

module.exports = router;
