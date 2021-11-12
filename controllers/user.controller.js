var { User } = require("../models/user.model");

module.exports.index = async (req, res) => {
	var users = await User.find();
	res.render("users/index", { users: users });
};
module.exports.search = async (req, res) => {
	var q = req.query.q;
	var users = await User.find();
	var matchedUsers = users.filter(function (user) {
		return (
			user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
			user.phone.indexOf(q) !== -1
		);
	});
	res.render("users/index", {
		users: matchedUsers,
	});
};
module.exports.create = async (req, res) => {
	res.render("users/create");
};
module.exports.getID = async (req, res) => {
	var id = req.params.id;
	var user = await User.findById(id);
	res.render("users/view", {
		user: user,
	});
};
module.exports.postCreate = async (req, res) => {
	await User.create(req.body);
	res.redirect("/users");
};
