var { Rent } = require("../models/room.model");
const nodemailer = require("nodemailer");
const pug = require("pug");

//Global variables get today
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = dd + "/" + mm + "/" + yyyy;

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
		// await transporter.sendMail({
		// 	from: '"Dream Hotel 👻" <DreamHotel@gmail.com>', // sender address
		// 	to: req.body.email, // list of receivers
		// 	subject: "Dream Hotel ✔", // Subject line
		// 	text: "Hello world?", // plain text body
		// 	html: pug.renderFile("C:/DEV/ExpressJS/views/email/email.pug"),
		// });
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
