var { Rent } = require("../models/room.model");

//Global variables get today
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = dd + "/" + mm + "/" + yyyy;

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
		req.body.state = false;
		req.body.booking_date = today;
		await Rent.create(req.body);

		res.redirect("/");
	}
	//email input is wrong
	else {
		errors.push("Email bạn đã nhập sai");
		res.render("booking/bookingform", {
			errors: errors,
		});
	}
};
