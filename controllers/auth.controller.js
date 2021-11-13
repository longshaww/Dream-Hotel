var { User } = require("../models/user.model");

module.exports.login = async (req, res) => {
	res.render("auth/login");
};
module.exports.postLogin = async (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	var user = await User.findOne({ email: email });
	if (!user) {
		res.render("auth/login", {
			errors: ["User does not exist"],
			values: req.body,
		});
		return;
	}
	if (user.password !== password) {
		res.render("auth/login", {
			errors: ["Wrong password"],
			values: req.body,
		});
		return;
	}
	res.cookie("userId", user._id, {
		signed: true,
		expires: new Date(Date.now() + 5000000),
		httpOnly: true,
	});
	res.redirect("/rooms");
};
