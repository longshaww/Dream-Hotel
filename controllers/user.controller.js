const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) => {
	res.render("users/index", { users: db.get("users").value() });
};
module.exports.search = (req, res) => {
	var q = req.query.q;
	var matchedUsers = db
		.get("users")
		.value()
		.filter(function (user) {
			return (
				user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
				user.phone.indexOf(q) !== -1
			);
		});
	res.render("users/index", {
		users: matchedUsers,
	});
};
module.exports.create = (req, res) => {
	res.render("users/create");
};
module.exports.getID = (req, res) => {
	var id = req.params.id;
	var user = db.get("users").find({ id: id }).value();
	res.render("users/view", {
		user: user,
	});
};
module.exports.postCreate = (req, res) => {
	req.body.id = shortid.generate();
	var errors = [];
	if (!req.body.name) {
		errors.push("Name is required");
	}
	if (!req.body.phone) {
		errors.push("Phone is required");
	}
	if (errors.length) {
		res.render("users/create", {
			errors: errors,
			values: req.body,
		});
		return;
	}
	db.get("users").push(req.body).write();
	res.redirect("/users");
};
