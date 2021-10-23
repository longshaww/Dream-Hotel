const mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
	name: String,
	phone: String,
});

var rentSchema = new mongoose.Schema({
	room_id: String,
	checkin_date: String,
	checkout_date: String,
	customer_info: [customerSchema],
});
var roomSchema = new mongoose.Schema({
	room_type: String,
	price: String,
	note: String,
	room_state: Boolean,
	room_id: String,
	image: String,
});
var Room = mongoose.model("Room", roomSchema, "rooms");
var Rent = mongoose.model("Rent", rentSchema, "rents");
var Customer = mongoose.model("Customers", customerSchema, "customers");

module.exports = {
	Room: Room,
	Rent: Rent,
	Customer: Customer,
};
