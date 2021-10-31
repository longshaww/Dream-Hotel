var { Customer } = require("../models/room.model");

module.exports.bookingHome = async (req, res) => {
	res.render("booking/bookinghome");
};
module.exports.bookingForm = async (req, res) => {
	res.render("booking/bookingform");
};
module.exports.postBookingForm = async (req, res) => {
	await Customer.create(req.body);
	res.redirect("/booking");
};
