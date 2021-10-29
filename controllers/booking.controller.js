var { Customer } = require("../models/room.model");

module.exports.bookingHome = async (req, res) => {
	res.render("booking/bookinghome");
};
module.exports.bookingForm = async (req, res) => {
	res.render("booking/bookingform");
};
module.exports.postBookingForm = async (req, res) => {
	var errors = [];
	if (!req.body.name) {
		errors.push("Bạn phải nhập tên");
	}
	if (!req.body.phone) {
		errors.push("Bạn phải nhập SĐT");
	}
	if (!req.body.CMND) {
		errors.push("Bạn phải nhập CMND");
	}
	if (!req.body.room_type) {
		errors.push("Bạn phải nhập loại phòng");
	}
	if (!req.body.checkin_date) {
		errors.push("Bạn phải nhập ngày checkin");
	}
	if (!req.body.checkout_date) {
		errors.push("Bạn phải nhập ngày checkout");
	}
	if (errors.length) {
		res.render("booking/bookingform", {
			errors: errors,
			values: req.body,
		});
		return;
	}
	await Customer.create(req.body);
	res.redirect("/booking");
};
