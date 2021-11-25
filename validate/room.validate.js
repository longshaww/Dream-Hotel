var { Room } = require("../models/room.model");
module.exports.createRoomValidation = async (req, res, next) => {
	var errors = [];
	const room = await Room.findOne({ room_id: req.body.room_id });
	if (room) {
		errors.push("Phòng đã tồn tại");
		console.log(room);
	}
	if (!req.body.room_id) {
		errors.push("RoomID is required");
	}
	if (!req.body.room_type) {
		errors.push("Room type is required");
	}
	if (!req.body.price) {
		errors.push("Price is required");
	}
	if (errors.length) {
		res.render("rooms/createroom", {
			errors: errors,
			values: req.body,
		});
		return;
	}
	next();
};
