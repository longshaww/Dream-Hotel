var { User } = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");

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
	if (req.file) {
		var avatar = await cloudinary.uploader.unsigned_upload(
			req.file.path,
			"oeaxhoph"
		);
		await User.create({
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			password: req.body.password,
			avatar: avatar.secure_url,
		});
		res.redirect("/users");
	} else {
		await User.create({
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			password: req.body.password,
			// avatar: avatar.secure_url,
		});
		res.redirect("/users");
	}
};

module.exports.editUser = async (req, res) => {
	var user = await User.findById(req.params.id);
	res.render("users/edit", { user: user });
};

module.exports.editUserHandling = async (req, res) => {
	if (req.file) {
		var avatar = await cloudinary.uploader.unsigned_upload(
			req.file.path,
			"oeaxhoph"
		);
		await User.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				name: req.body.name,
				phone: req.body.phone,
				email: req.body.email,
				password: req.body.password,
				avatar: avatar.secure_url,
			},
			{
				new: true,
			}
		);
		res.redirect("/users");
	} else {
		await User.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				name: req.body.name,
				phone: req.body.phone,
				email: req.body.email,
				password: req.body.password,
				avatar: "",
			},
			{
				new: true,
			}
		);
		res.redirect("/users");
	}
};

module.exports.deleteUser = async (req, res) => {
	await User.findByIdAndRemove(req.params.id);
	res.redirect("/users");
};
