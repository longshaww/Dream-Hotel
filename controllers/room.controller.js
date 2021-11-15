const moment = require("moment");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const cloudinary = require("../utils/cloudinary");
const pug = require("pug");
const path = require("path");

var {
	Room,
	Rent,
	Customer,
	Payment,
	Service,
	Voucher,
} = require("../models/room.model");

//nodemailer
let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: "at400123@gmail.com",
		pass: "zddxyogvmgcgxsgu",
	},
	tls: {
		// do not fail on invalid certs
		rejectUnauthorized: false,
	},
});

//Global variables get today
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = dd + "/" + mm + "/" + yyyy;

module.exports.roomHome = async (req, res) => {
	var rooms = await Room.find().populate("customer");

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
	if (req.file) {
		var image = await cloudinary.uploader.unsigned_upload(
			req.file.path,
			"oeaxhoph"
		);
		await Room.create({
			room_type: req.body.room_type,
			price: req.body.price,
			note: req.body.note,
			room_id: req.body.room_id,
			image: image.secure_url,
		});
		res.redirect("/rooms");
	} else {
		await Room.create({
			room_type: req.body.room_type,
			price: req.body.price,
			note: req.body.note,
			room_id: req.body.room_id,
			// image: image.secure_url,
		});
		res.redirect("/rooms");
	}
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
	if (req.file) {
		var image = await cloudinary.uploader.unsigned_upload(
			req.file.path,
			"oeaxhoph"
		);
		await Room.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				room_type: req.body.room_type,
				price: req.body.price,
				note: req.body.note,
				room_id: req.body.room_id,
				image: image.secure_url,
			},
			{ new: true }
		);
		res.redirect("/rooms/" + req.params.id);
	} else {
		await Room.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				room_type: req.body.room_type,
				price: req.body.price,
				note: req.body.note,
				room_id: req.body.room_id,
				image: "",
			},
			{ new: true }
		);
		res.redirect("/rooms/" + req.params.id);
	}
};
module.exports.checkInForm = async (req, res) => {
	var customers = await Customer.find();
	var rooms = await Room.find().populate("customer");
	res.render("rooms/checkin", {
		rooms: rooms,
		customers: customers,
		today: today,
	});
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
	await Rent.create({
		room: room._id,
		customer: customer._id,
	});
	//create new field on Room for rerender
	await Room.updateOne(
		{ _id: room._id },
		{ customer: customer._id }, // rent: rent._id
		{ multi: true }
	);
	await Customer.updateOne(
		{ _id: customer._id },
		{ checkin_state: true },
		{ multi: true }
	);

	res.redirect("/rooms");
};

module.exports.rentHistory = async (req, res) => {
	var rents = await Rent.find();
	res.render("rooms/rents", {
		rents: rents,
	});
};

module.exports.confirmRent = async (req, res) => {
	var rent = await Rent.findById(req.params.id);
	res.render("rooms/rent-confirm", { rent: rent });
};

module.exports.postRent = async (req, res) => {
	var errors = [];
	var rent = await Rent.findById(req.params.id);
	var name = req.body.name;
	var email = req.body.email;

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	if (validateEmail(email)) {
		await Rent.updateOne({ _id: req.params.id }, { state: true });
		await Customer.create(req.body);
		await transporter.sendMail({
			from: '"Dream Hotel 👻" <DreamHotel@gmail.com>', // sender address
			to: req.body.email, // list of receivers
			subject: "Dream Hotel ✔", // Subject line
			text: "Cảm ơn bạn đã đặt phòng tại Dream Hotel ! Chúng tôi sẽ sớm gọi bạn để xác nhận thông tin", // plain text body
			html: pug.renderFile(path.resolve("./views/email/email.pug"), {
				name: name,
			}),
		});
		res.redirect("/rooms/rents");
	} else {
		errors.push("Email bạn đã nhập sai");
		res.render("rooms/rent-confirm", {
			rent: rent,
			errors: errors,
		});
	}
};

module.exports.checkOutForm = async (req, res) => {
	res.render("rooms/checkout");
};

//global variables to reuse in postCash
var summaryServices;
var checkout;
var duration;
var totalNoDiscount;
module.exports.postCheckOut = async (req, res) => {
	var errors = [];
	checkout = await Room.findOne({ room_id: req.body.room_id }).populate({
		path: "customer",
		populate: { path: "services" },
	});

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
		var services = checkout.customer.services;
		if (services) {
			var prices = services.map(function (item) {
				return item.price.slice(1);
			});
			summaryServices = prices.reduce(function (a, b) {
				return parseFloat(a) + parseFloat(b);
			}, 0);
		}
		var checkInDate = moment(
			checkout.customer.checkin_date,
			"DD/MM/YYYY"
		);
		var checkOutDate = moment(
			checkout.customer.checkout_date,
			"DD/MM/YYYY"
		);
		duration = moment.duration(checkOutDate.diff(checkInDate)).asDays();
		res.render("rooms/checkout", {
			errors: errors,
			checkout: checkout,
			services: services,
			duration: duration,
			summaryServices: summaryServices,
		});
	}
};
module.exports.onlinePayment = async (req, res) => {
	res.render("rooms/online-payment");
};

module.exports.cashPayment = async (req, res) => {
	totalNoDiscount = Math.ceil(
		parseFloat(checkout.price.slice(1)) * duration + summaryServices
	);
	res.render("rooms/cash-payment", {
		checkout: checkout,
		duration: duration,
		summaryServices: summaryServices,
		totalNoDiscount: totalNoDiscount,
	});
};

module.exports.checkVoucher = async (req, res) => {
	var error;
	var voucher = await Voucher.findOne({ code: req.body.code });

	if (voucher) {
		//số phần trăm giảm
		var discount = voucher.discount / 100;
		//tổng chưa giảm

		//Số tiền giảm
		var discountedMoney = Math.round(discount * totalNoDiscount);
		// số tiền tổng đã có discount = tổng chưa giảm - số tiền giảm
		var totalDiscount = totalNoDiscount - discountedMoney;

		res.render("rooms/cash-payment", {
			voucher: voucher,
			checkout: checkout,
			duration: duration,
			summaryServices: summaryServices,
			totalDiscount: totalDiscount,
		});
	} else {
		error = "Mã voucher không hợp lệ";
		res.render("rooms/cash-payment", {
			checkout: checkout,
			duration: duration,
			summaryServices: summaryServices,
			error: error,
			totalNoDiscount: totalNoDiscount,
		});
	}
};

module.exports.postCash = async (req, res) => {
	var checkout = await Room.findOne({ room_id: req.params.id }).populate(
		"customer"
	);
	await Payment.create({
		//name phone cmnd => customer_id
		//room_id,days_rent => room_id
		customer: checkout.customer._id,
		room: checkout._id,
		discount: req.body.discount,
		//Services
		// services_price: req.body.services_price,
		days_rent: req.body.days_rent,
		summary: req.body.summary,
		pay_date: today,
	});
	await Room.updateOne(
		{ room_id: req.body.room_id },
		{ $unset: { customer: 1 } }
	);
	await Customer.updateOne(
		{ _id: checkout.customer._id },
		{ checkout_state: true },
		{ multi: true }
	);

	//Thêm trạng thái cho khách hàng checkin:true , checkout:true || false
	res.redirect("/rooms");
};

module.exports.paymentHistory = async (req, res) => {
	var payments = await Payment.find().populate("customer").populate("room");
	res.render("rooms/payment-history", { payments: payments });
};

module.exports.paymentSearch = async (req, res) => {
	var payments = await Payment.find().populate("customer").populate("room");
	var q = req.query.q;
	// var end = req.query.end
	var matchedPayments = payments.filter(function (payment) {
		var split = payment.pay_date.split("/");
		return split[1] === q;
	});
	if (!q) {
		matchedPayments = payments;
	}
	res.render("rooms/payment-history", { payments: matchedPayments });
};

module.exports.services = async (req, res) => {
	var services = await Service.find();
	res.render("rooms/services", { services: services });
};

module.exports.newService = async (req, res) => {
	res.render("rooms/new-service");
};

module.exports.postService = async (req, res) => {
	await Service.create({ content: req.body.content, price: req.body.price });
	res.redirect("/rooms/services");
};

module.exports.deleteService = async (req, res) => {
	await Service.findByIdAndRemove({ _id: req.params.id });
	res.redirect("/rooms/services");
};

module.exports.editService = async (req, res) => {
	var service = await Service.findById(req.params.id);
	res.render("rooms/edit-service", { service: service });
};

module.exports.editServiceHandling = async (req, res) => {
	await Service.findByIdAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	});
	res.redirect("/rooms/services");
};

module.exports.vouchers = async (req, res) => {
	var vouchers = await Voucher.find();
	res.render("rooms/vouchers", { vouchers: vouchers });
};

module.exports.newVoucher = async (req, res) => {
	var code = shortid.generate();
	res.render("rooms/new-voucher", { code: code });
};

module.exports.postVoucher = async (req, res) => {
	await Voucher.create({
		code: req.body.code,
		date_start: req.body.date_start,
		date_end: req.body.date_end,
		discount: req.body.discount,
	});
	res.redirect("/rooms/vouchers");
};

module.exports.editVoucher = async (req, res) => {
	var voucher = await Voucher.findById(req.params.id);
	res.render("rooms/edit-voucher", { voucher: voucher });
};

module.exports.editVoucherHandling = async (req, res) => {
	await Voucher.findByIdAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	});
	res.redirect("/rooms/vouchers");
};

module.exports.deleteVoucher = async (req, res) => {
	await Voucher.findByIdAndRemove(req.params.id);
	res.redirect("/rooms/vouchers");
};
