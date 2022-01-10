const { Room, Charts } = require("../../models/room.model");

const roomHome = async (req, res) => {
	const rooms = await Room.find().populate("customer");
	res.json(rooms);
};

const createRoom = async (req, res) => {
	const room = await Room.create(req.body);
	res.json(room);
};

const editRoom = async (req, res) => {
	const room = await Room.findByIdAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ new: true }
	);
	res.json(room);
};

const deleteRoom = async (req, res) => {
	const room = await Room.findOneAndRemove({ _id: req.params.id });
	res.json(room);
};

const singleRoom = async (req, res) => {
	const room = await Room.findById(req.params.id);
	res.json(room);
};

const getPayment = async (req, res) => {
	const charts = await Charts.find();
	res.json(charts);
};

module.exports = {
	roomHome,
	createRoom,
	editRoom,
	deleteRoom,
	singleRoom,
	getPayment,
};
