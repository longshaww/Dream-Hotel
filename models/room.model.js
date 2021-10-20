const mongoose = require("mongoose");

var roomSchema = new mongoose.Schema({
	room_type: String,
	price: String,
	note: String,
	room_state: Boolean,
	room_id: String,
	image: String,
});
var Room = mongoose.model("Room", roomSchema, "rooms");
module.exports = Room;
