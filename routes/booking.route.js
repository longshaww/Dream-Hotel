const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");

router.get("/", controller.bookingForm);
router.post("/", controller.postBookingForm);
module.exports = router;
