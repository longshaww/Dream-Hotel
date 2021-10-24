const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("booking/bookinghome");
});
router.get("/bookingform", async (req, res) => {
	res.render("booking/bookingform");
});
module.exports = router;
