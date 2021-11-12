var { Rent } = require("../models/room.model");

//Global variables get today
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = dd + "/" + mm + "/" + yyyy;

module.exports.bookingHome = async (req, res) => {
	res.render("booking/bookinghome");
};
module.exports.bookingForm = async (req, res) => {
	res.render("booking/bookingform");
};
module.exports.postBookingForm = async (req, res) => {
	var errors = [];
	var email = req.body.email;
	//validate email
	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	//if email input is correct
	if (validateEmail(email)) {
		await Rent.create({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			CMND: req.body.CMND,
			room_type: req.body.room_type,
			checkin_date: req.body.checkin_date,
			checkout_date: req.body.checkout_date,
			state: false,
			booking_date: today,
		});

		res.redirect("/booking");
	}
	//email input is wrong
	else {
		errors.push("Email bạn đã nhập sai");
		res.render("booking/bookingform", {
			errors: errors,
		});
	}
};
