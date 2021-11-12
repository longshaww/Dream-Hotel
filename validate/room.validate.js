module.exports.createRoomValidation = (req, res, next) => {
	var errors = [];
	if (!req.body.room_id) {
		errors.push("RoomID is required");
	}
	if (!req.body.room_type) {
		errors.push("Room type is required");
	}
	if (!req.body.price) {
		errors.push("Price is required");
	}
	if (!req.body.room_state) {
		errors.push("Room state is required");
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
