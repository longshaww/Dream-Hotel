const mongoose = require("mongoose");

var customerSchema = new mongoose.Schema(
	{
		name: String,
		phone: String,
		CMND: String,
		room_type: String,
		checkin_date: String,
		checkout_date: String,
		checkin_state: Boolean,
		checkout_state: Boolean,
	},
	{
		collection: "customers",
	}
);

var rentSchema = new mongoose.Schema(
	{
		room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customers",
		},
	},
	{ collection: "rents" }
);
var roomSchema = new mongoose.Schema(
	{
		room_type: String,
		price: String,
		note: String,
		room_state: Boolean,
		room_id: String,
		image: String,
		rent: { type: mongoose.Schema.Types.ObjectId, ref: "Rent" },
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customers" },
	},
	{ collection: "rooms" }
);

var paymentSChema = new mongoose.Schema(
	{
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customers" },
		room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
		days_rent: String,
		summary: String,
		pay_date: String,
	},
	{ collection: "payment" }
);
var Room = mongoose.model("Room", roomSchema, "rooms");
var Rent = mongoose.model("Rent", rentSchema, "rents");
var Customer = mongoose.model("Customers", customerSchema, "customers");
var Payment = mongoose.model("Payments", paymentSChema, "payment");

module.exports = {
	Room: Room,
	Rent: Rent,
	Customer: Customer,
	Payment: Payment,
};
