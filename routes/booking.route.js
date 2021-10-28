const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");

router.get("/", controller.bookingHome);
router.get("/bookingform", controller.bookingForm);
router.post("/bookingform", controller.postBookingForm);
module.exports = router;
