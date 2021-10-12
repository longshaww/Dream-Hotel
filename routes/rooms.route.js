const express = require("express");
const db = require("../db");
// const controller = require("../controllers/room.controller");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("rooms/roomhome", { rooms: db.get("rooms").value() });
});
router.get("/search", (req, res) => {
	var q = req.query.q;
	var matchedRooms = db
		.get("rooms")
		.value()
		.filter(function (room) {
			return (
				room.room_type.toLowerCase().indexOf(q.toLowerCase()) !== -1
			);
		});
	res.render("rooms/roomhome", {
		rooms: matchedRooms,
	});
});
module.exports = router;
