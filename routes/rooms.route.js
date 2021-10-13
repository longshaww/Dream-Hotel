const express = require("express");
const db = require("../db");
const shortid = require("shortid");
const { value, values } = require("../db");
const { application } = require("express");
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
router.get("/create", (req, res) => {
	res.render("rooms/createroom");
});
router.post("/create", (req, res) => {
	req.body.id = shortid.generate();
	var errors = [];
	if (!req.body.room_id) {
		errors.push("RoomID is required");
	}
	if (!req.body.room_type) {
		errors.push("Room type is required");
	}
	if (!req.body.price) {
		errors.push("Price is required");
	}
	if (!req.body.room_state) {
		errors.push("Room state is required");
	}
	if (errors.length) {
		res.render("rooms/createroom", {
			errors: errors,
			values: req.body,
		});
		return;
	}
	db.get("rooms").push(req.body).write();
	res.redirect("/rooms");
});

router.get("/:id", (req, res) => {
	var id = req.params.id;
	var room = db.get("rooms").find({ id: id }).value();
	res.render("rooms/view", {
		room: room,
	});
});
router.delete("/:id", (req, res) => {
	var id = req.params.id;
	var delRoom = db.get("rooms").remove({ id: id }).write();
	res.send(delRoom);
});
module.exports = router;
