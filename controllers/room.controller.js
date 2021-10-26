const { forEach } = require("../db");
var { Room } = require("../models/room.model");
var { Rent } = require("../models/room.model");
var { Customer } = require("../models/room.model");
module.exports.roomHome = async (req, res) => {
	var rooms = await Room.find().populate("rent").populate("customer");

	res.render("rooms/roomhome", {
		rooms: rooms,
	});
};

module.exports.searchRoom = async (req, res) => {
	var rooms = await Room.find().populate("rent").populate("customer");
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
	var customers = await Customer.find();
	res.render("rooms/checkin", { customers: customers });
};
module.exports.postCheckIn = async (req, res) => {
	var customer = await Customer.findOne({
		name: req.body.name,
	});

	if (!customer) {
		res.render("rooms/checkin", {
			errors: ["Khách hàng không tồn tại"],
			values: req.body,
		});
		return;
	}
	if (customer.phone !== req.body.phone) {
		res.render("rooms/checkin", {
			errors: ["SĐT không khớp"],
			values: req.body,
		});
		return;
	}
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0");
	var yyyy = today.getFullYear();
	today = dd + "/" + mm + "/" + yyyy;
	//find room_id = req.body.room_id
	var room = await Room.findOne({ room_id: req.body.room_id });
	//create new rent
	var rent = await Rent.create({
		room: room._id,
		customer: customer._id,
		checkin_date: today,
		checkout_date: req.body.checkout_date,
	});
	//create new field on Room for rerender
	await Room.updateOne(
		{ _id: room._id },
		{ rent: rent._id, customer: customer._id },
		{ multi: true }
	);
	res.redirect("/rooms");
};
