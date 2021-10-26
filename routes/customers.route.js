const express = require("express");
const router = express.Router();
const { Customer } = require("../models/room.model");

router.get("", async (req, res) => {
	var customers = await Customer.find();
	res.render("customers/customers", { customers: customers });
});
module.exports = router;
