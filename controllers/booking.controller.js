var { Customer } = require("../models/room.model");
const nodemailer = require("nodemailer");
const pug = require("pug");

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
		await Customer.create(req.body);
		await transporter.sendMail({
			from: '"Dream Hotel 👻" <DreamHotel@gmail.com>', // sender address
			to: req.body.email, // list of receivers
			subject: "Dream Hotel ✔", // Subject line
			text: "Hello world?", // plain text body
			html: pug.renderFile("C:/DEV/ExpressJS/views/email/email.pug"),
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
