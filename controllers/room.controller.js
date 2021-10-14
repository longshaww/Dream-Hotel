const db = require("../db");
const shortid = require("shortid");
const { value, values } = require("../db");
const { application } = require("express");

module.exports.roomHome = (req, res) => {
	res.render("rooms/roomhome", { rooms: db.get("rooms").value() });
};
module.exports.searchRoom = (req, res) => {
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
};

module.exports.createRoomPug = (req, res) => {
	res.render("rooms/createroom");
};

module.exports.createRoomValidation = (req, res) => {
	req.body.id = shortid.generate();

	db.get("rooms").push(req.body).write();
	res.redirect("/rooms");
};
module.exports.viewRoom = (req, res) => {
	var id = req.params.id;
	var room = db.get("rooms").find({ id: id }).value();
	res.render("rooms/view", {
		room: room,
	});
};
module.exports.deleteRoom = (req, res) => {
	var id = req.params.id;
	db.get("rooms").remove({ id: id }).write();
	res.redirect("/rooms");
};
module.exports.editRoomPug = (req, res) => {
	var id = req.params.id;
	var room = db.get("rooms").find({ id: id }).value();
	res.render("rooms/edit", { room: room });
};
module.exports.editRoomHandling = (req, res) => {
	var id = req.params.id;
	db.get("rooms").find({ id: id }).assign(req.body).write();
	res.redirect("/rooms/" + id);
};
