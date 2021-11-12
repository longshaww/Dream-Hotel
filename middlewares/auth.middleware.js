var { User } = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
	if (!req.signedCookies.userId) {
		res.redirect("/auth/login");
		return;
	}
	var user = await User.findOne({ _id: req.signedCookies.userId });
	if (!user) {
		res.redirect("/auth/login");
		return;
	}
	res.locals.user = user;
	next();
};
