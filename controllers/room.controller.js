const { forEach } = require("../db");
var { Room } = require("../models/room.model");
var { Rent } = require("../models/room.model");
var { Customer } = require("../models/room.model");
module.exports.roomHome = async (req, res) => {
	var rooms = await Room.aggregate([
		{
			$lookup: {
				from: "rents", // collection name in db
				localField: "room_id",
				foreignField: "room_id",
				as: "Rent",
			},
		},
	]);
	res.render("rooms/roomhome", {
		rooms: rooms,
	});
};

module.exports.searchRoom = async (req, res) => {
	var rooms = await Room.aggregate([
		{
			$lookup: {
				from: "rents", // collection name in db
				localField: "room_id",
				foreignField: "room_id",
				as: "Rent",
			},
		},
	]);
	var q = req.query.q;
	var matchedRooms = rooms.filter(function (room) {
		return room.room_type.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	res.render("rooms/roomhome", {
		rooms: matchedRooms,
	});
};

module.exports.createRoomPug = (req, res) => {
	res.render("rooms/createroom");
};

module.exports.createRoomValidation = async (req, res) => {
	var remain = "còn";
	var over = "hết";
	if (
		req.body.room_state
			.toLowerCase()
			.localeCompare(remain.toLowerCase()) === 0
	) {
		req.body.room_state = true;
		await Room.create(req.body);
		res.redirect("/rooms");
		return;
	}
	if (
		req.body.room_state
			.toLowerCase()
			.localeCompare(over.toLowerCase()) === 0
	) {
		req.body.room_state = false;
		await Room.create(req.body);
		res.redirect("/rooms");
		return;
	}
	res.render("rooms/createroom", {
		errors: ["Wrong room state !!! Please try again"],
		values: req.body,
	});
};
module.exports.viewRoom = async (req, res) => {
	var id = req.params.id;
	var room = await Room.findById(id);
	res.render("rooms/view", {
		room: room,
	});
};
module.exports.deleteRoom = async (req, res) => {
	var id = req.params.id;
	await Room.findByIdAndRemove({ _id: id });
	res.redirect("/rooms");
};
module.exports.editRoomPug = async (req, res) => {
	var id = req.params.id;
	var room = await Room.findById(id);
	res.render("rooms/edit", { room: room });
};
module.exports.editRoomHandling = async (req, res) => {
	var id = req.params.id;
	await Room.findByIdAndUpdate({ _id: id }, req.body, { new: true });
	res.redirect("/rooms/" + id);
};
module.exports.checkInForm = async (req, res) => {
	res.render("rooms/checkin");
};
module.exports.postCheckIn = async (req, res) => {
	var matchedName = await Rent.find({
		customer_info: { $elemMatch: { name: req.body.name } },
	});
	var matchedPhone = await Rent.find({
		customer_info: { $elemMatch: { phone: req.body.phone } },
	});
	if (!matchedName.length) {
		res.render("rooms/checkin", {
			errors: ["Khách hàng không tồn tại"],
			values: req.body,
		});
		return;
	}
	if (!matchedPhone.length) {
		res.render("rooms/checkin", {
			errors: ["SĐT không khớp"],
			values: req.body,
		});
	}
	await Rent.create({
		room_id: req.body.room_id,
		checkin_date: req.body.checkin_date,
		checkout_date: req.body.checkout_date,
		customer_info: [{ name: req.body.name, phone: req.body.phone }],
	});
	res.locals.customer = matchedName;
	res.redirect("/rooms");
};
