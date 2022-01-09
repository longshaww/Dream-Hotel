const mongoose = require("mongoose");

var customerSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		phone: String,
		CMND: String,
		room_type: String,
		checkin_date: String,
		checkout_date: String,
		checkin_state: Boolean,
		checkout_state: Boolean,
		room_id: String,
		services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
	},
	{
		collection: "customers",
		versionKey: false,
	}
);

var rentSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		phone: String,
		CMND: String,
		room_type: String,
		checkin_date: String,
		checkout_date: String,
		booking_date: String,
		state: Boolean,
		room_id: String,
	},
	{ collection: "rents", versionKey: false }
);
var roomSchema = new mongoose.Schema(
	{
		room_type: {
			type: String,
			enum: ["Standard", "Superior", "Deluxe", "Luxury"],
		},
		price: { type: String, enum: ["$10", "$20", "$30", "$40"] },
		note: String,
		room_state: Boolean,
		room_id: String,
		image: String,
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customers" },
		available: [String],
	},
	{ collection: "rooms", versionKey: false }
);

var paymentSChema = new mongoose.Schema(
	{
		customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customers" },
		room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
		days_rent: String,
		summary: String,
		discount: String,
		pay_date: String,
	},
	{ collection: "payment", versionKey: false }
);
var serviceSchema = new mongoose.Schema(
	{
		content: String,
		price: String,
	},
	{ collection: "services", versionKey: false }
);

var voucherSchema = new mongoose.Schema(
	{
		code: String,
		date_start: String,
		date_end: String,
		discount: String,
	},
	{
		collection: "vouchers",
		versionKey: false,
	}
);

var Room = mongoose.model("Room", roomSchema, "rooms");
var Rent = mongoose.model("Rent", rentSchema, "rents");
var Customer = mongoose.model("Customers", customerSchema, "customers");
var Payment = mongoose.model("Payments", paymentSChema, "payment");
var Service = mongoose.model("Services", serviceSchema, "services");
var Voucher = mongoose.model("Vouchers", voucherSchema, "vouchers");

module.exports = {
	Room: Room,
	Rent: Rent,
	Customer: Customer,
	Payment: Payment,
	Service: Service,
	Voucher: Voucher,
};
