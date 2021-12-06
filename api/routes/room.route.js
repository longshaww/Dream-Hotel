const express = require("express");
const controller = require("../controllers/room.controller");
const router = express.Router();

router.get("/", controller.roomHome);
router.post("/", controller.createRoom);
router.put("/:id", controller.editRoom);
router.get("/:id", controller.singleRoom);
router.delete("/:id", controller.deleteRoom);

module.exports = router;
