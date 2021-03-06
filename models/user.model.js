const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
	{
		name: String,
		phone: String,
		email: String,
		password: String,
		avatar: String,
		permission: Number,
		position: String,
	},
	{
		collection: "users",
	}
);

var User = mongoose.model("Users", userSchema, "users");
module.exports = { User: User };
