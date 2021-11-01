const { forEach } = require("../db");
var { Room } = require("../models/room.model");
var { Rent } = require("../models/room.model");
var { Customer } = require("../models/room.model");
var { Payment } = require("../models/room.model");
const moment = require("moment");

module.exports.roomHome = async (req, res) => {
	var rooms = await Room.find().populate("customer");

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + "/" + mm + "/" + yyyy;

	res.render("rooms/roomhome", {
		rooms: rooms,
		today: today,
	});
};

module.exports.searchRoom = async (req, res) => {
	var rooms = await Room.find().populate("customer");
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
	var rooms = await Room.find().populate("customer");
	res.render("rooms/checkin", { rooms: rooms, customers: customers });
};
module.exports.searchCustomer = async (req, res) => {
	var customers = await Customer.find();
	var q = req.query.q;
	var matchedCustomers = customers.filter(function (customer) {
		return customer.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	var rooms = await Room.find().populate("customer");
	res.render("rooms/checkin", {
		customers: matchedCustomers,
		rooms: rooms,
	});
};
module.exports.searchRo = async (req, res) => {
	var customers = await Customer.find();
	var rooms = await Room.find().populate("customer");
	var q = req.query.q;
	var matchedRooms = rooms.filter(function (room) {
		return (
			room.room_type.toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
			room.room_id.toLowerCase().indexOf(q.toLowerCase()) !== -1
		);
	});

	res.render("rooms/checkin", {
		customers: customers,
		rooms: matchedRooms,
	});
};

module.exports.postCheckIn = async (req, res) => {
	var customer = await Customer.findOne({
		name: req.body.name,
	});
	var rerenderRoom = await Room.find().populate("customer");
	var rerenderCustomer = await Customer.find();
	if (!customer) {
		res.render("rooms/checkin", {
			errors: ["Khách hàng không tồn tại"],
			values: req.body,
			rooms: rerenderRoom,
			customers: rerenderCustomer,
		});
		return;
	}
	if (customer.phone !== req.body.phone) {
		res.render("rooms/checkin", {
			errors: ["SĐT không khớp"],
			values: req.body,
			rooms: rerenderRoom,
			customers: rerenderCustomer,
		});
		return;
	}
	var room = await Room.findOne({ room_id: req.body.room_id });
	// create new rent
	var rent = await Rent.create({
		room: room._id,
		customer: customer._id,
	});
	//create new field on Room for rerender
	await Room.updateOne(
		{ _id: room._id },
		{ customer: customer._id }, // rent: rent._id
		{ multi: true }
	);
	res.redirect("/rooms");
};

module.exports.rentHistory = async (req, res) => {
	var rents = await Rent.find().populate("customer").populate("room");
	res.render("rooms/history", {
		rents: rents,
	});
};

module.exports.checkOutForm = async (req, res) => {
	res.render("rooms/checkout");
};

module.exports.postCheckOut = async (req, res) => {
	var errors = [];
	var checkout = await Room.findOne({ room_id: req.body.room_id }).populate(
		"customer"
	);
	if (checkout == null) {
		errors.push("Phòng không tồn tại");
		res.render("rooms/checkout", {
			errors: errors,
		});
		return;
	}
	if (!checkout.customer) {
		errors.push("Phòng không có khách");
		res.render("rooms/checkout", {
			errors: errors,
		});
		return;
	} else {
		var checkInDate = moment(
			checkout.customer.checkin_date,
			"DD/MM/YYYY"
		);
		var checkOutDate = moment(
			checkout.customer.checkout_date,
			"DD/MM/YYYY"
		);
		var duration = moment
			.duration(checkOutDate.diff(checkInDate))
			.asDays();
		res.render("rooms/checkout", {
			errors: errors,
			checkout: checkout,
			duration: duration,
		});
	}
};
module.exports.onlinePayment = async (req, res) => {
	res.render("rooms/online-payment");
};

module.exports.cashPayment = async (req, res) => {
	var checkout = await Room.findOne({ room_id: req.params.id }).populate(
		"customer"
	);
	var checkInDate = moment(checkout.customer.checkin_date, "DD/MM/YYYY");
	var checkOutDate = moment(checkout.customer.checkout_date, "DD/MM/YYYY");
	var duration = moment.duration(checkOutDate.diff(checkInDate)).asDays();
	res.render("rooms/cash-payment", {
		checkout: checkout,
		duration: duration,
	});
};

module.exports.postCash = async (req, res) => {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + "/" + mm + "/" + yyyy;

	await Payment.create({
		//name phone cmnd => customer_id
		//room_id,days_rent => room_id
		name: req.body.name,
		phone: req.body.phone,
		CMND: req.body.CMND,
		room_id: req.body.room_id,
		days_rent: req.body.days_rent,
		price_per_day: req.body.price_per_day,
		summary: req.body.summary,
		pay_date: today,
	});
	await Room.updateOne(
		{ room_id: req.body.room_id },
		{ $unset: { customer: 1 } }
	);

	res.redirect("/rooms");
};
