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

module.exports.adminRequire = async (req, res, next) => {
	var user = await User.findOne({ _id: req.signedCookies.userId });
	if (user.permission < 3) {
		res.render("auth/refuse-permission", {
			permission: "Admin Required",
		});
	}
	next();
};

module.exports.managerRequire = async (req, res, next) => {
	var user = await User.findOne({ _id: req.signedCookies.userId });
	if (user.permission <= 2) {
		res.render("auth/refuse-permission", {
			permission: "Manager Required",
		});
	}
	next();
};
